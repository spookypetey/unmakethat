export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-surface-2 px-6 py-12 text-center font-mono text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p>&copy; 2026 UNMAKETHAT / SPOOKYBOYZ. ALL RIGHTS RESERVED.</p>
        <div className="flex items-center gap-6">
          {["INSTAGRAM", "SOUNDCLOUD", "SPOTIFY", "DISTROKID"].map((s) => (
            <a key={s} href="#" className="transition-colors hover:text-primary">
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
