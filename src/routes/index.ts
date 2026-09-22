import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/store/SectionHeader";
import { ProductCard, BeatRow } from "@/components/store/ProductCard";
import { productsQuery } from "@/lib/products.queries";
import { categorize } from "@/lib/shopify";
import studioImg from "@/assets/beat-voidwalker.jpg";
import logoImage from "@/assets/unmakethat-logo.png";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "UNMAKETHAT — Beats, Releases & SPOOKYBOYZ Merch" },
      {
        name: "description",
        content:
          "Official store of UnmakeThat, New Jersey producer and founder of SPOOKYBOYZ. License darkwave and trap beats, buy vinyl and heavyweight merch.",
      },
      { property: "og:title", content: "UNMAKETHAT — Beats, Releases & SPOOKYBOYZ Merch" },
      { property: "og:description", content: "License beats instantly. Vinyl, cassettes and heavyweight SPOOKYBOYZ gear shipped worldwide." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Empty({ label }: { label: string }) {
  return (
    <div className="card-dark rounded-2xl p-12 text-center font-mono text-xs text-muted-foreground">
      No {label} found yet.
    </div>
  );
}

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const beats = products.filter((p) => categorize(p) === "beats");
  const releases = products.filter((p) => categorize(p) === "releases");
  const merch = products.filter((p) => categorize(p) === "merch");

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden border-b border-border/80 px-6">
        <div className="liquid-blob pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl text-center animate-fade-up">
          <span className="eyebrow mb-6 inline-block rounded-full border border-border bg-surface px-3 py-1">
            Independent Producer &amp; Label Head
          </span>
          <h1 className="mb-6 flex justify-center">
            <img
              src={logoImage}
              alt="UNMAKETHAT"
              width={1536}
              height={1024}
              className="w-full max-w-xs drop-shadow-[0_0_40px_oklch(1_0_0/0.15)] md:max-w-2xl"
            />
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Darkwave soundscapes, industrial club rhythms, and experimental hip-hop production straight from New
            Jersey. Founder of SPOOKYBOYZ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="chrome" size="xl" asChild>
              <a href="#beats">
                <Play className="h-4 w-4 fill-current" /> Browse beats
              </a>
            </Button>
            <Button variant="dark" size="xl" asChild>
              <a href="#merch">Explore merch</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Beats */}
      <section id="beats" className="mx-auto max-w-7xl scroll-mt-24 border-b border-border/60 px-6 py-24">
        <SectionHeader
          eyebrow="Beat store"
          title="LICENSE A BEAT"
          blurb="Basic MP3, Premium WAV + trackout stems, or full Exclusive rights. Instant delivery after checkout."
        />
        {beats.length === 0 ? (
          <Empty label="beats" />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {beats.map((p) => (
              <BeatRow key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Releases */}
      <section id="releases" className="mx-auto max-w-7xl scroll-mt-24 border-b border-border/60 px-6 py-24">
        <SectionHeader
          eyebrow="Discography"
          title="ALBUMS & EPS"
          blurb="Physical vinyl pressings, cassette editions, and digital album bundles."
        />
        {releases.length === 0 ? (
          <Empty label="releases" />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Merch */}
      <section id="merch" className="mx-auto max-w-7xl scroll-mt-24 border-b border-border/60 px-6 py-24">
        <SectionHeader
          eyebrow="Apparel & goods"
          title="SPOOKYBOYZ GEAR"
          blurb="Heavyweight cotton garments, custom accessories, and limited-run drops."
        />
        {merch.length === 0 ? (
          <Empty label="merch" />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {merch.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-1 items-center gap-16 border-b border-border/60 px-6 py-24 lg:grid-cols-2">
        <div>
          <span className="eyebrow mb-2 block">The architect</span>
          <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">UNMAKETHAT</h2>
          <p className="mb-6 font-light leading-relaxed text-muted-foreground">
            Based out of New Jersey, UnmakeThat is a visionary music producer and the founder of the SPOOKYBOYZ
            collective and label. Blending aggressive industrial low-end with cinematic darkwave atmospheres, the
            sound transcends traditional genre boundaries.
          </p>
          <div className="grid grid-cols-2 gap-6 border-t border-border pt-6 font-mono text-xs">
            <div>
              <span className="mb-1 block font-display text-2xl font-bold text-primary">NJ / US</span>
              <span className="text-muted-foreground">BASE OF OPERATIONS</span>
            </div>
            <div>
              <span className="mb-1 block font-display text-2xl font-bold text-primary">SPOOKYBOYZ</span>
              <span className="text-muted-foreground">FOUNDER &amp; LABEL HEAD</span>
            </div>
          </div>
        </div>
        <div className="card-dark relative aspect-square overflow-hidden rounded-2xl p-2">
          <img
            src={studioImg}
            alt="Studio setup"
            loading="lazy"
            width={1024}
            height={1024}
            className="h-full w-full rounded-xl object-cover grayscale transition-all duration-500 hover:grayscale-0"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 via-transparent to-transparent p-8">
            <span className="font-mono text-xs text-foreground/80">FL STUDIO // ANALOG HARDWARE // DARKWAVE</span>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-24">
        <div className="mb-16 text-center">
          <span className="eyebrow mb-2 block">Direct inquiries</span>
          <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">BOOKING &amp; COLLABORATION</h2>
        </div>
        <BookingForm />
      </section>
    </main>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm text-foreground focus:border-ring focus:outline-none";

function BookingForm() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`[${fd.get("type")}] Inquiry from ${fd.get("name")}`);
    const body = encodeURIComponent(`${fd.get("message")}\n\n— ${fd.get("name")} (${fd.get("email")})`);
    window.location.href = `mailto:booking@unmakethat.com?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="card-dark space-y-6 rounded-2xl p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow mb-2 block">Your name</span>
          <input name="name" required className={inputCls} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="eyebrow mb-2 block">Email address</span>
          <input name="email" type="email" required className={inputCls} placeholder="you@example.com" />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow mb-2 block">Inquiry type</span>
        <select name="type" className={inputCls}>
          <option>Live Performance / DJ Set</option>
          <option>Production Collaboration / Remix</option>
          <option>Commercial Sync Licensing</option>
          <option>General Inquiry</option>
        </select>
      </label>
      <label className="block">
        <span className="eyebrow mb-2 block">Message details</span>
        <textarea name="message" rows={4} required className={inputCls} placeholder="Describe your project, dates, or budget..." />
      </label>
      <Button type="submit" variant="chrome" size="xl" className="w-full rounded-lg">
        Send inquiry
      </Button>
    </form>
  );
}