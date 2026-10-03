"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AccountShell from "@/Components/AccountShell";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconMapPin,
  IconPlus,
  IconTrash,
  IconPhone,
  IconBuildingCommunity,
  IconLoader2,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Address } from "@/types/address.types";
import { addressSchema, AddressSchemaValues } from "@/schemas/address.schema";
import { EGYPTIAN_GOVERNORATES } from "@/constants/governorates";
export default function AddressesView() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteAddress, setConfirmDeleteAddress] =
    useState<Address | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressSchemaValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      details: "",
      phone: "",
      city: "Cairo",
    },
  });
  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch("/api/addresses", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.status === 401) {
        setAddresses([]);
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setAddresses(data.data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      console.error("Fetch addresses error:", err);
      toast.error("Failed to load saved addresses");
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);
  const handleOpenModal = () => {
    reset({
      name: "",
      details: "",
      phone: "",
      city: "Cairo",
    });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const onSubmitAddress = async (values: AddressSchemaValues) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add address");
      }
      toast.success("Delivery address added successfully");
      handleCloseModal();
      await fetchAddresses();
    } catch (error: unknown) {
      console.error("Save address error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Could not save delivery address";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteAddress = async () => {
    if (!confirmDeleteAddress) return;
    const addressId = confirmDeleteAddress._id;
    try {
      setDeletingId(addressId);
      const res = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to remove address");
      }
      toast.info("Address removed from your address book");
      setConfirmDeleteAddress(null);
      setAddresses((prev) => prev.filter((item) => item._id !== addressId));
    } catch (error: unknown) {
      console.error("Delete address error:", error);
      const message =
        error instanceof Error ? error.message : "Could not delete address";
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-xs">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
            <IconMapPin size={36} stroke={1.8} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Sign In to Manage Addresses
          </h1>
          <p className="text-gray-500 max-w-md mx-auto mb-8 text-sm sm:text-base">
            Your saved delivery locations are linked securely to your FreshCart
            account. Sign in now to view and manage them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login?returnUrl=/addresses"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs transition-all"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all"
            >
              Browse Groceries
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <AccountShell active="addresses">
      <div className="account-section-heading">
        <div>
          <h2>My Addresses</h2>
          <p>Manage your saved delivery addresses</p>
        </div>
        <button className="store-button" onClick={handleOpenModal}>
          <IconPlus size={18} />
          Add Address
        </button>
      </div>
      {isLoading ? (
        <div className="store-card store-empty animate-pulse">
          Loading addresses...
        </div>
      ) : addresses.length === 0 ? (
        <div className="store-card store-empty">
          <h2>No saved addresses yet</h2>
          <p>Add your delivery address to make checkout easier.</p>
          <button className="store-button" onClick={handleOpenModal}>
            Add Address
          </button>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((addr) => (
            <article key={addr._id} className="store-card address-card">
              <IconMapPin size={22} />
              <div>
                <h3>{addr.name}</h3>
                <p>{addr.details}</p>
                <div className="address-meta">
                  <span>
                    <IconPhone size={14} />
                    {addr.phone}
                  </span>
                  <span>
                    <IconBuildingCommunity size={14} />
                    {addr.city}
                  </span>
                </div>
              </div>
              <div className="address-actions">
                <button
                  onClick={() => setConfirmDeleteAddress(addr)}
                  aria-label={`Delete address ${addr.name}`}
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <IconX size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IconMapPin size={22} stroke={2} />
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Add Delivery Address
                </h2>
                <p className="text-xs text-gray-500">
                  Enter your address details for accurate courier dispatch
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(onSubmitAddress)}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address Label / Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home, Office, Summer House"
                  {...register("name")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Street &amp; Building Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 15 El-Tahrir St, Apt 4B, 3rd Floor"
                  {...register("details")}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
                {errors.details && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.details.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Governorate / City
                  </label>
                  <select
                    {...register("city")}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {EGYPTIAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="01012345678"
                    {...register("phone")}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:bg-emerald-400"
                >
                  {isSubmitting ? (
                    <>
                      <IconLoader2 size={16} className="animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <span>Save Address</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteAddress && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <IconAlertTriangle size={32} stroke={1.8} />
            </div>
            <h2
              id="delete-dialog-title"
              className="text-xl font-bold text-gray-900 mb-2"
            >
              Delete Delivery Address?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-gray-800">
                &ldquo;{confirmDeleteAddress.name}&rdquo;
              </span>{" "}
              ({confirmDeleteAddress.city})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteAddress(null)}
                disabled={Boolean(deletingId)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Keep Address
              </button>
              <button
                type="button"
                onClick={handleDeleteAddress}
                disabled={Boolean(deletingId)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:bg-rose-400"
              >
                {deletingId ? (
                  <>
                    <IconLoader2 size={16} className="animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Delete Address</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
