import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="grid gap-5 border border-line bg-surface p-6 sm:p-8">
        <p className="eyebrow text-accent">404</p>
        <h1 className="text-5xl leading-none sm:text-7xl">Lost In The Grid</h1>
        <p className="max-w-md text-sm uppercase tracking-[0.18em] text-muted">
          The piece you were looking for is no longer on this layer.
        </p>
        <Link href="/drop" className="pa-button w-fit">
          Return To Drop
        </Link>
      </div>
    </section>
  );
}
