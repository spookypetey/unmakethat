import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Truck, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { productQuery } from "@/lib/products.queries";
import { categorize, formatPrice } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.handle));
    if (!product) throw notFound();
    return { title: product.node.title, description: product.node.description, image: product.node.images.edges[0]?.node.url };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Product"} — UNMAKETHAT` },
      { name: "description", content: loaderData?.description?.slice(0, 160) ?? "UNMAKETHAT beats and merch." },
      { property: "og:title", content: `${loaderData?.title ?? "Product"} — UNMAKETHAT` },
      { property: "og:description", content: loaderData?.description?.slice(0, 160) ?? "" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(loaderData?.image
        ? [
            { property: "og:image", content: loaderData.image },
            { name: "twitter:image", content: loaderData.image },
          ]
        : []),
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(handle));
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const isLoading = useCartStore((s) => s.isLoading);
  const [variantId, setVariantId] = useState(product?.node.variants.edges[0]?.node.id ?? "");

  if (!product) return null;
  const { node } = product;
  const variants = node.variants.edges.map((e) => e.node);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];
  const img = node.images.edges[0]?.node;
  const category = categorize(product);
  const isDigital = category === "beats";

  const handleAdd = async () => {
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    toast.success(`${node.title} added to cart`, { position: "top-center" });
    setOpen(true);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5" /> BACK TO STORE
      </Link>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="card-dark overflow-hidden rounded-2xl">
          {img && <img src={img.url} alt={img.altText ?? node.title} width={1024} height={1024} className="aspect-square w-full object-cover" />}
        </div>
        <div className="flex flex-col">
          <span className="eyebrow mb-3">{node.productType}</span>
          <h1 className="font-display text-4xl font-bold tracking-tight text-primary md:text-5xl">{node.title}</h1>
          <p className="mt-3 font-mono text-2xl font-bold text-primary">
            {variant ? formatPrice(variant.price.amount, variant.price.currencyCode) : ""}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{node.description}</p>

          {variants.length > 1 && (
            <div className="mt-8">
              <span className="eyebrow mb-3 block">{node.options[0]?.name ?? "Option"}</span>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    disabled={!v.availableForSale}
                    className={`rounded-lg border px-4 py-2.5 text-xs font-bold tracking-wide transition-colors disabled:opacity-40 ${
                      v.id === variant?.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface text-foreground hover:border-ring"
                    }`}
                  >
                    {v.title}
                    {variants.length > 1 && (
                      <span className="ml-2 font-mono font-normal opacity-70">{formatPrice(v.price.amount, v.price.currencyCode)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <Button variant="chrome" size="xl" className="w-full" onClick={handleAdd} disabled={isLoading || !variant?.availableForSale}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : variant?.availableForSale ? "Add to cart" : "Sold out"}
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-border pt-6 font-mono text-xs text-muted-foreground sm:grid-cols-2">
            {isDigital ? (
              <>
                <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Instant download after purchase</span>
                <span className="flex items-center gap-2">Exclusive = full rights transfer</span>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2"><Truck className="h-4 w-4" /> Worldwide shipping</span>
                <span className="flex items-center gap-2">Secure checkout via Shopify</span>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
