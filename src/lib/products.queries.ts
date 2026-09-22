import { queryOptions } from "@tanstack/react-query";
import { fetchProductByHandle, fetchProducts } from "./shopify";

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => fetchProducts(),
  staleTime: 60_000,
});

export const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 60_000,
  });
