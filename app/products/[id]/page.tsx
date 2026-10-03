import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  IconChevronRight,
  IconHomeFilled,
  IconStarFilled,
  IconStarHalfFilled,
  IconStar,
  IconShieldCheck,
  IconTruckDelivery,
  IconRefresh,
} from "@tabler/icons-react";
import { getProductById } from "@/services/products.service";
import ProductGallery from "@/Components/ProductGallery";
import ProductActions from "@/Components/ProductActions";
import ProductDetailsTabs from "@/Components/ProductDetailsTabs";
import RelatedProducts from "@/Components/RelatedProducts";
import styles from "./details.module.css";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product)
    return {
      title: "Product Not Found | FreshCart",
      description: "The requested grocery item is unavailable.",
    };
  const description =
    product.description?.replace(/(\r\n|\n|\r)/gm, " ").slice(0, 160) ||
    "Buy fresh groceries and pantry items online with FreshCart.";
  return {
    title: `${product.title} | FreshCart`,
    description,
    openGraph: {
      title: `${product.title} - FreshCart`,
      description,
      images: [
        {
          url: product.imageCover,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
}
export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();
  const discounted =
    product.priceAfterDiscount != null &&
    product.priceAfterDiscount < product.price;
  const price = discounted ? product.priceAfterDiscount! : product.price;
  const rating = product.ratingsAverage ?? 0;
  const stock = product.quantity ?? 0;
  const trust = [
    {
      icon: IconTruckDelivery,
      title: "Free Delivery",
      detail: "Orders over $50",
    },
    { icon: IconRefresh, title: "30 Days Return", detail: "Money back" },
    {
      icon: IconShieldCheck,
      title: "Secure Payment",
      detail: "100% Protected",
    },
  ];
  return (
    <div className={styles.page + " min-h-screen bg-white"}>
      <div className="mx-auto max-w-[1568px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1.5 hover:text-primary-600"
              >
                <IconHomeFilled size={15} />
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="px-2">
              <IconChevronRight size={15} />
            </li>
            <li>
              <Link
                href={`/products?category=${product.category?._id ?? ""}`}
                className="hover:text-primary-600"
              >
                {product.category?.name || "Products"}
              </Link>
            </li>
            {product.subcategory?.[0] && (
              <>
                <li aria-hidden="true" className="px-2">
                  <IconChevronRight size={15} />
                </li>
                <li>{product.subcategory[0].name}</li>
              </>
            )}
            <li aria-hidden="true" className="px-2">
              <IconChevronRight size={15} />
            </li>
            <li aria-current="page" className="font-medium text-gray-900">
              {product.title}
            </li>
          </ol>
        </nav>
        <div className="grid items-start gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2.915fr)]">
          <ProductGallery
            images={product.images || []}
            imageCover={product.imageCover}
            title={product.title}
          />
          <section className="min-w-0 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-4 flex flex-wrap gap-2">
              {product.category?.name && (
                <Link
                  href={`/products?category=${product.category._id}`}
                  className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700"
                >
                  {product.category.name}
                </Link>
              )}
              {product.brand?.name && (
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                  {product.brand.name}
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-9 text-gray-900">
              {product.title}
            </h1>
            <div className="mt-3 flex h-6 items-center gap-3">
              <div
                className="flex text-yellow-400"
                aria-label={`${rating} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const Star =
                    rating >= i + 1
                      ? IconStarFilled
                      : rating > i
                        ? IconStarHalfFilled
                        : IconStar;
                  return <Star key={i} size={20} aria-hidden="true" />;
                })}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {rating} ({product.ratingsQuantity ?? 0} reviews)
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold leading-9 text-gray-900">
                {price} EGP
              </span>
              {discounted && (
                <span className="text-gray-400 line-through">
                  {product.price} EGP
                </span>
              )}
            </div>
            <div className="my-6">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${stock > 0 ? "bg-primary-50 text-primary-700" : "bg-red-50 text-red-700"}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${stock > 0 ? "bg-primary-500" : "bg-red-500"}`}
                />
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <p className="mb-6 border-t border-gray-100 pt-5 leading-[26px] text-gray-600">
              {product.description || "No description available."}
            </p>
            <ProductActions
              productId={product._id || product.id}
              title={product.title}
              stock={stock}
              price={price}
            />
            <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
              {trust.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-900">
                      {title}
                    </h2>
                    <p className="text-xs text-gray-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <ProductDetailsTabs product={product} />
        <RelatedProducts
          categoryId={product.category?._id}
          currentProductId={product._id || product.id}
        />
      </div>
    </div>
  );
}
