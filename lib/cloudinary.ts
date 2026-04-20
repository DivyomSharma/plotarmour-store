import { v2 as cloudinary } from "cloudinary";
import { env, hasCloudinaryEnv } from "@/lib/env";

let configured = false;

function ensureCloudinary() {
  if (!hasCloudinaryEnv) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinaryCloudName,
      api_key: env.cloudinaryApiKey,
      api_secret: env.cloudinaryApiSecret,
      secure: true,
    });
    configured = true;
  }
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    publicId: string;
    format?: string;
  },
) {
  ensureCloudinary();

  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        public_id: options.publicId,
        resource_type: "image",
        format: options.format,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }

        resolve({ secure_url: result.secure_url });
      },
    );

    stream.end(buffer);
  });
}

export async function uploadRemoteImageToCloudinary(
  url: string,
  options: {
    folder: string;
    publicId: string;
    format?: string;
  },
) {
  ensureCloudinary();

  const result = await cloudinary.uploader.upload(url, {
    folder: options.folder,
    public_id: options.publicId,
    resource_type: "image",
    format: options.format,
    overwrite: true,
  });

  return { secure_url: result.secure_url };
}
