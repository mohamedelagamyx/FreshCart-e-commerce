"use client";
import Link from "next/link";
import Image from "next/image";
import {
  IconHeartFilled,
  IconShoppingCart,
  IconTrash,
  IconLoader2,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import StoreHeading from "@/Components/StoreHeading";
export default function WishlistView() {
  const { wishlistItems, isLoading, removeFromWishlist, isMutating } =
    useWishlist();
  const { addToCart, mutatingProductId } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  return (
    <div className="store-screen store-wishlist">
      <StoreHeading
        title="My Wishlist"
        breadcrumb="Wishlist"
        subtitle={
          isLoading
            ? "Loading saved items..."
            : `${wishlistItems.length} items saved`
        }
        icon={<IconHeartFilled size={26} />}
      />
      <div className="store-container store-body">
        {authLoading || isLoading ? (
          <div className="store-card store-empty animate-pulse">
            Loading your wishlist...
          </div>
        ) : !isAuthenticated ? (
          <div className="store-card store-empty">
            <h2>Sign In to View Your Wishlist</h2>
            <p>Your saved products are linked to your account.</p>
            <Link href="/login?returnUrl=/wishlist" className="store-button">
              Sign In
            </Link>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="store-card store-empty">
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products and come back to them anytime.</p>
            <Link href="/products" className="store-button">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="store-card">
            <table className="wishlist-table">
              <thead>
                <tr>
                  <th style={{ width: "54%" }}>Product</th>
                  <th style={{ width: "16%" }}>Price</th>
                  <th style={{ width: "16%" }}>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((product) => {
                  const id = product._id || product.id;
                  const price =
                    product.priceAfterDiscount &&
                    product.priceAfterDiscount < product.price
                      ? product.priceAfterDiscount
                      : product.price;
                  const adding = mutatingProductId === id;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="wishlist-product">
                          <Link href={`/products/${id}`}>
                            <Image
                              src={
                                product.imageCover || "/product-placeholder.svg"
                              }
                              alt={product.title}
                              fill
                              sizes="80px"
                            />
                          </Link>
                          <div>
                            <Link href={`/products/${id}`}>
                              <h2>{product.title}</h2>
                            </Link>
                            <p>{product.category?.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="wishlist-price">
                        {price.toLocaleString()} EGP
                        {price < product.price && (
                          <del>{product.price.toLocaleString()} EGP</del>
                        )}
                      </td>
                      <td>
                        <span className="store-stock">
                          {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td>
                        <div className="wishlist-actions">
                          <button
                            className="store-button"
                            onClick={() => addToCart(id, 1)}
                            disabled={adding || product.quantity === 0}
                          >
                            {adding ? (
                              <IconLoader2 size={16} className="animate-spin" />
                            ) : (
                              <IconShoppingCart size={16} />
                            )}
                            Add to Cart
                          </button>
                          <button
                            className="store-trash"
                            aria-label={`Remove ${product.title} from wishlist`}
                            disabled={isMutating(id)}
                            onClick={() => removeFromWishlist(id)}
                          >
                            {isMutating(id) ? (
                              <IconLoader2 size={16} className="animate-spin" />
                            ) : (
                              <IconTrash size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Link
          className="store-muted mt-8 inline-flex items-center gap-2"
          href="/products"
        >
          <IconArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
