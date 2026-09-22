import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import logoAsset from "@/assets/unmakethat-logo.png.asset.json";

const NAV = [
  { label: "BEATS", to: "/#beats" },
  { label: "RELEASES", to: "/#releases" },
  { label: "MERCH", to: "/#merch" },
  { label: "ABOUT", to: "/#about" },
  { label: "BOOKING", to: "/#booking" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const setOpen = useCartStore((s) => s.setOpen);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <>
      <div className="eyebrow border-b border-border/80 bg-surface py-2 px-4 text-center">
        SPOOKYBOYZ COLLECTIVE // NEW JERSEY // WORLDWIDE SHIPPING &amp; DIGITAL DELIVERY
      </div>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center" aria-label="UNMAKETHAT home">
            <img src={logoAsset.url} alt="UNMAKETHAT" width={1536} height={1024} className="h-12 w-auto" />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium tracking-wide text-muted-foreground md:flex">
            {NAV.map((n) => (
              <a key={n.label} href={n.to} className="transition-colors hover:text-primary">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-primary transition-colors hover:border-ring"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              className="p-2 text-primary md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="flex flex-col gap-4 border-b border-border bg-surface px-6 py-4 text-sm font-medium md:hidden">
            {NAV.map((n) => (
              <a key={n.label} href={n.to} onClick={() => setMobileOpen(false)} className="text-foreground/80">
                {n.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
