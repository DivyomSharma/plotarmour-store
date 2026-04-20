import path from "node:path";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import Replicate from "replicate";
import { NextResponse } from "next/server";
import { uploadBufferToCloudinary, uploadRemoteImageToCloudinary } from "@/lib/cloudinary";
import {
  env,
  hasCloudinaryEnv,
  hasReplicateEnv,
} from "@/lib/env";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { isAbsoluteUrl } from "@/lib/utils";
import type { GarmentType } from "@/types";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function normalizeGarmentType(value: FormDataEntryValue | null): GarmentType {
  const garmentType = typeof value === "string" ? value : "top";

  if (
    garmentType === "top" ||
    garmentType === "bottom" ||
    garmentType === "outer" ||
    garmentType === "dress"
  ) {
    return garmentType;
  }

  return "top";
}

function createTryOnCacheKey(input: string | Buffer) {
  return createHash("sha256").update(input).digest("hex");
}

async function resolveGarmentImage(productImageUrl: string, publicId: string) {
  if (isAbsoluteUrl(productImageUrl)) {
    return productImageUrl;
  }

  const localPath = path.join(
    process.cwd(),
    "public",
    productImageUrl.replace(/^\/+/, ""),
  );
  const fileBuffer = await readFile(localPath);
  const upload = await uploadBufferToCloudinary(fileBuffer, {
    folder: "plot-armour/try-on/garments",
    publicId,
    format: "png",
  });

  return upload.secure_url;
}

export async function POST(request: Request) {
  try {
    if (!hasCloudinaryEnv || !hasReplicateEnv) {
      return NextResponse.json(
        {
          error:
            "Try-on is not configured yet. Add Cloudinary and Replicate keys to enable generation.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const image = formData.get("image");
    const productImageUrl = formData.get("productImageUrl");
    const productName = formData.get("productName");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { error: "A portrait image is required." },
        { status: 400 },
      );
    }

    if (typeof productImageUrl !== "string" || !productImageUrl) {
      return NextResponse.json(
        { error: "A product image URL is required." },
        { status: 400 },
      );
    }

    const fileBuffer = Buffer.from(await image.arrayBuffer());

    if (fileBuffer.byteLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Upload a file under 8MB." },
        { status: 400 },
      );
    }

    const garmentType = normalizeGarmentType(formData.get("garmentType"));
    const cacheKey = createTryOnCacheKey(
      Buffer.concat([
        fileBuffer,
        Buffer.from(`${productImageUrl}:${garmentType}:${productName ?? ""}`),
      ]),
    );

    const supabase = getSupabaseAdminClient();

    if (supabase) {
      const { data } = await supabase
        .from("try_on_results")
        .select("result_url, source_url")
        .eq("cache_key", cacheKey)
        .maybeSingle();

      if (data?.result_url) {
        return NextResponse.json(
          {
            cacheKey,
            resultUrl: data.result_url,
            sourceUrl: data.source_url,
            cached: true,
          },
          {
            headers: {
              "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
            },
          },
        );
      }
    }

    const modelImageUpload = await uploadBufferToCloudinary(fileBuffer, {
      folder: "plot-armour/try-on/uploads",
      publicId: `${cacheKey}-model`,
      format: "webp",
    });

    const garmentImageUrl = await resolveGarmentImage(
      productImageUrl,
      `${cacheKey}-garment`,
    );

    const replicate = new Replicate({
      auth: env.replicateApiToken!,
    });
    const modelRef = "cuuupid/idm-vton" as const;

    const output = await replicate.run(modelRef, {
      input: {
        human_img: modelImageUpload.secure_url,
        garm_img: garmentImageUrl,
      },
    });

    const rawOutputUrl = Array.isArray(output) ? String(output[0] ?? "") : String(output ?? "");

    if (!rawOutputUrl) {
      throw new Error("Replicate returned an empty result.");
    }

    let finalResultUrl = rawOutputUrl;

    try {
      const storedResult = await uploadRemoteImageToCloudinary(rawOutputUrl, {
        folder: "plot-armour/try-on/results",
        publicId: `${cacheKey}-result`,
        format: "webp",
      });

      finalResultUrl = storedResult.secure_url;
    } catch {
      finalResultUrl = rawOutputUrl;
    }

    if (supabase) {
      await supabase.from("try_on_results").upsert({
        cache_key: cacheKey,
        product_image_url: productImageUrl,
        garment_type: garmentType,
        source_url: modelImageUpload.secure_url,
        result_url: finalResultUrl,
      });
    }

    return NextResponse.json(
      {
        cacheKey,
        resultUrl: finalResultUrl,
        sourceUrl: modelImageUpload.secure_url,
        cached: false,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Try-on request failed.",
      },
      { status: 500 },
    );
  }
}
