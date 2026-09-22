export function SectionHeader({ eyebrow, title, blurb }: { eyebrow: string; title: string; blurb: string }) {
  return (
    <div className="mb-12 flex flex-col justify-between md:flex-row md:items-end">
      <div>
        <span className="eyebrow mb-2 block">{eyebrow}</span>
        <h2 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">{title}</h2>
      </div>
      <p className="mt-4 max-w-sm text-sm text-muted-foreground md:mt-0">{blurb}</p>
    </div>
  );
}
