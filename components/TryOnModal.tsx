"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types";

type TryOnModalProps = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

export default function TryOnModal({
  product,
  open,
  onClose,
}: TryOnModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [isPending, startTransition] = useTransition();

  const previewUrl = useMemo(() => {
    if (!selectedFile) {
      return null;
    }

    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleGenerate() {
    if (!selectedFile) {
      setError("Upload a clear portrait before generating.");
      return;
    }

    setError(null);

    startTransition(() => {
      void (async () => {
        try {
          const formData = new FormData();
          formData.append("image", selectedFile);
          formData.append("productImageUrl", product.images[0]);
          formData.append("garmentType", product.garmentType);
          formData.append("productName", product.name);

          const response = await fetch("/api/tryon", {
            method: "POST",
            body: formData,
          });

          const payload = (await response.json()) as {
            resultUrl?: string;
            error?: string;
          };

          if (!response.ok || !payload.resultUrl) {
            throw new Error(payload.error ?? "Generation failed.");
          }

          setResultUrl(payload.resultUrl);
        } catch (generationError) {
          setError(
            generationError instanceof Error
              ? generationError.message
              : "Generation failed.",
          );
        }
      })();
    });
  }

  async function handleDownload() {
    if (!resultUrl) {
      return;
    }

    const response = await fetch(resultUrl);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${product.slug}-try-on.webp`;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }

  async function handleShare() {
    if (!resultUrl) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: `${product.name} Try-On`,
        url: resultUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(resultUrl);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  }

  function resetState() {
    setSelectedFile(null);
    setResultUrl(null);
    setError(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/82 backdrop-blur-md"
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="relative grid w-full max-w-6xl overflow-hidden border border-white/16 bg-black text-white lg:grid-cols-[1.1fr_0.9fr]"
            >
              <button
                type="button"
                onClick={resetState}
                className="absolute right-4 top-4 z-10 border border-white/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white hover:border-white"
              >
                Close
              </button>

              <div className="poster-grid relative min-h-[32rem] border-b border-white/12 bg-neutral-950 p-5 lg:border-b-0 lg:border-r">
                {resultUrl ? (
                  <div className="relative h-full min-h-[32rem]">
                    <Image
                      src={resultUrl}
                      alt={`${product.name} try-on result`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                ) : previewUrl ? (
                  <div className="relative h-full min-h-[32rem]">
                    <Image
                      src={previewUrl}
                      alt="Uploaded portrait preview"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[32rem] items-end justify-between border border-white/12 p-6">
                    <div>
                      <p className="eyebrow text-accent">Try On</p>
                      <h3 className="mt-3 text-5xl leading-none">
                        Upload
                        <br />
                        Frame
                      </h3>
                    </div>
                    <div className="relative h-40 w-32 border border-white/14 bg-white/4">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="160px"
                        className="object-cover opacity-80"
                      />
                    </div>
                  </div>
                )}

                {isPending ? (
                  <div className="pointer-events-none absolute inset-x-6 bottom-6 overflow-hidden border border-white/12 bg-black/72 px-4 py-4">
                    <div className="mb-3 text-[11px] uppercase tracking-[0.3em] text-white/72">
                      Generating Look
                    </div>
                    <div className="relative h-[2px] overflow-hidden bg-white/10">
                      <motion.div
                        className="absolute inset-y-0 left-0 w-1/3 bg-accent"
                        animate={{ x: ["-20%", "260%"] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.1, ease: "linear" }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-6 p-5 md:p-7">
                <div className="border-b border-white/12 pb-5">
                  <p className="eyebrow text-accent">Generate</p>
                  <h3 className="mt-3 text-4xl leading-none sm:text-5xl">
                    {product.name}
                  </h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/68">
                    Upload a front-facing image. Clear lighting gets the cleanest fit.
                  </p>
                </div>

                <label className="grid gap-3 border border-white/14 p-4 hover:border-white/28">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/72">
                    Portrait Upload
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      setSelectedFile(event.target.files?.[0] ?? null);
                      setResultUrl(null);
                      setError(null);
                    }}
                    className="block w-full text-xs uppercase tracking-[0.16em] text-white/72 file:mr-4 file:border file:border-white/20 file:bg-transparent file:px-4 file:py-3 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.26em] file:text-white"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isPending}
                    className="pa-button"
                  >
                    {isPending ? "Generating" : "Generate"}
                  </button>
                  <button
                    type="button"
                    onClick={resetState}
                    className="pa-button-secondary border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
                  >
                    Reset
                  </button>
                </div>

                {error ? (
                  <p className="border border-accent/40 bg-accent/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white">
                    {error}
                  </p>
                ) : null}

                {resultUrl ? (
                  <div className="grid gap-3 border-t border-white/12 pt-5">
                    <button type="button" onClick={handleDownload} className="pa-button">
                      Download Image
                    </button>
                    <button
                      type="button"
                      onClick={handleShare}
                      className="pa-button-secondary border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
                    >
                      {shareState === "copied" ? "Copied" : "Share"}
                    </button>
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={resetState}
                      className="pa-button-secondary border-white/20 text-white hover:border-white hover:bg-white hover:text-black"
                    >
                      Buy This
                    </Link>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
