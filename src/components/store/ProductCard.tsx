import { Link } from "@tanstack/react-router";
import { Loader2, Play } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const { node } = product;
  const img = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const hasOptions = node.variants.edges.length > 1;
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);

  const quickAdd = async () => {
    const v = node.variants.edges[0]?.node;
    if (!v) return;
    await addItem({
      product,
      variantId: v.id,
      variantTitle: v.title,
      price: v.price,
      quantity: 1,
      selectedOptions: v.selectedOptions,
    });
    toast.success(`${node.title} added to cart`, { position: "top-center" });
    setOpen(true);
  };

  return (
    <div className="card-dark group flex flex-col overflow-hidden rounded-2xl">
      <Link to="/product/$handle" params={{ handle: node.handle }} className="relative aspect-square overflow-hidden bg-muted">
        {img && (
          <img
            src={img.url}
            alt={img.altText ?? node.title}
            loading="lazy"
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="eyebrow mb-2">{node.productType}</span>
        <Link to="/product/$handle" params={{ handle: node.handle }}>
          <h3 className="font-display text-lg font-bold tracking-wide text-primary hover:underline">{node.title}</h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{node.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-primary">
            {hasOptions ? "FROM " : ""}
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasOptions ? (
            <Link
              to="/product/$handle"
              params={{ handle: node.handle }}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-chrome"
            >
              SELECT
            </Link>
          ) : (
            <button
              onClick={quickAdd}
              disabled={isLoading}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-chrome disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "ADD TO CART"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function BeatRow({ product }: { product: ShopifyProduct }) {
  const { node } = product;
  const img = node.images.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;

  return (
    <div className="card-dark flex items-center justify-between gap-4 rounded-xl p-4">
      <Link to="/product/$handle" params={{ handle: node.handle }} className="flex min-w-0 flex-1 items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
          {img && <img src={img.url} alt={node.title} loading="lazy" width={112} height={112} className="h-full w-full object-cover" />}
          <span className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity hover:opacity-100">
            <Play className="h-4 w-4 fill-primary text-primary" />
          </span>
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-bold text-primary hover:underline">{node.title}</h4>
          <p className="truncate text-xs text-muted-foreground">UnmakeThat &bull; {node.description.split(".")[1]?.trim() || "Instant delivery"}</p>
        </div>
      </Link>
      <div className="flex flex-shrink-0 items-center gap-3">
        <Link
          to="/product/$handle"
          params={{ handle: node.handle }}
          className="rounded bg-accent px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-primary"
        >
          LICENSES
        </Link>
        <Link
          to="/product/$handle"
          params={{ handle: node.handle }}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-chrome"
        >
          {formatPrice(price.amount, price.currencyCode)}
        </Link>
      </div>
    </div>
  );
}
