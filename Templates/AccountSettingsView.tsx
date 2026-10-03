"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  IconUserFilled,
  IconLockFilled,
  IconDeviceFloppy,
  IconEye,
  IconEyeOff,
  IconLoader2,
} from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import AccountShell from "@/Components/AccountShell";
import { profileSchema, changePasswordSchema } from "@/schemas/account.schema";
export default function AccountSettingsView() {
  const { user, isAuthenticated, isLoading, updateUser, checkAuth } = useAuth();
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const profile = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });
  const password = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", password: "", rePassword: "" },
  });
  const { reset } = profile;
  useEffect(() => {
    if (user)
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
  }, [user, reset]);
  async function saveProfile(values: z.infer<typeof profileSchema>) {
    setProfileError("");
    try {
      const response = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Unable to update profile");
      if (data.user) updateUser(data.user);
      toast.success(data.message);
    } catch (error) {
      setProfileError(
        error instanceof Error ? error.message : "Unable to connect",
      );
    }
  }
  async function savePassword(values: z.infer<typeof changePasswordSchema>) {
    setPasswordError("");
    try {
      const response = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Unable to change password");
      password.reset();
      await checkAuth();
      toast.success(data.message);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to connect",
      );
    }
  }
  if (isLoading)
    return (
      <div className="store-container store-empty animate-pulse">
        Loading your account...
      </div>
    );
  if (!isAuthenticated)
    return (
      <div className="store-container store-empty">
        <h2>Sign In to Manage Your Account</h2>
        <Link
          href="/login?returnUrl=/account/settings"
          className="store-button"
        >
          Sign In
        </Link>
      </div>
    );
  return (
    <AccountShell active="settings">
      <div className="account-section-heading">
        <div>
          <h2>Account Settings</h2>
          <p>Update your profile information and change your password</p>
        </div>
      </div>
      <section className="store-card settings-card">
        <form
          className="store-card-body"
          onSubmit={profile.handleSubmit(saveProfile)}
          noValidate
        >
          <div className="settings-title">
            <IconUserFilled size={24} />
            <div>
              <h3>Profile Information</h3>
              <p className="store-muted">Update your personal details</p>
            </div>
          </div>
          {profileError && (
            <div className="store-error" role="alert">
              {profileError}
            </div>
          )}
          {(
            [
              {
                key: "name",
                label: "Full Name",
                placeholder: "Enter your full name",
                type: "text",
                auto: "name",
              },
              {
                key: "email",
                label: "Email Address",
                placeholder: "Enter your email",
                type: "email",
                auto: "email",
              },
              {
                key: "phone",
                label: "Phone Number",
                placeholder: "01xxxxxxxxx",
                type: "tel",
                auto: "tel",
              },
            ] as const
          ).map((field) => (
            <div className="store-field" key={field.key}>
              <label htmlFor={`profile-${field.key}`}>{field.label}</label>
              <input
                id={`profile-${field.key}`}
                {...profile.register(field.key)}
                type={field.type}
                autoComplete={field.auto}
                placeholder={field.placeholder}
                disabled={profile.formState.isSubmitting}
                aria-invalid={!!profile.formState.errors[field.key]}
              />
              {profile.formState.errors[field.key] && (
                <small>{profile.formState.errors[field.key]?.message}</small>
              )}
            </div>
          ))}
          <button
            className="store-button"
            disabled={profile.formState.isSubmitting}
          >
            {profile.formState.isSubmitting ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconDeviceFloppy size={18} />
            )}
            Save Changes
          </button>
        </form>
        <div className="settings-info">
          <h3>Account Information</h3>
          <p>
            User ID <span>{user?.id || "—"}</span>
          </p>
          <p>
            Role <span className="store-stock">{user?.role || "User"}</span>
          </p>
        </div>
      </section>
      <section className="store-card settings-card settings-password">
        <form
          className="store-card-body"
          onSubmit={password.handleSubmit(savePassword)}
          noValidate
        >
          <div className="settings-title">
            <IconLockFilled size={24} />
            <div>
              <h3>Change Password</h3>
              <p className="store-muted">Update your account password</p>
            </div>
          </div>
          {passwordError && (
            <div className="store-error" role="alert">
              {passwordError}
            </div>
          )}
          {(
            [
              {
                key: "currentPassword",
                label: "Current Password",
                placeholder: "Enter your current password",
              },
              {
                key: "password",
                label: "New Password",
                placeholder: "Enter your new password",
              },
              {
                key: "rePassword",
                label: "Confirm New Password",
                placeholder: "Confirm your new password",
              },
            ] as const
          ).map((field) => (
            <div className="store-field" key={field.key}>
              <label htmlFor={`account-${field.key}`}>{field.label}</label>
              <div className="password-input">
                <input
                  id={`account-${field.key}`}
                  {...password.register(field.key)}
                  type={visible[field.key] ? "text" : "password"}
                  autoComplete={
                    field.key === "currentPassword"
                      ? "current-password"
                      : "new-password"
                  }
                  placeholder={field.placeholder}
                  disabled={password.formState.isSubmitting}
                  aria-invalid={!!password.formState.errors[field.key]}
                />
                <button
                  type="button"
                  onClick={() =>
                    setVisible((state) => ({
                      ...state,
                      [field.key]: !state[field.key],
                    }))
                  }
                  aria-label={
                    visible[field.key] ? "Hide password" : "Show password"
                  }
                >
                  {visible[field.key] ? (
                    <IconEyeOff size={18} />
                  ) : (
                    <IconEye size={18} />
                  )}
                </button>
              </div>
              {field.key === "password" && (
                <p className="text-xs text-gray-400 mt-1">
                  Must be at least 6 characters
                </p>
              )}
              {password.formState.errors[field.key] && (
                <small>{password.formState.errors[field.key]?.message}</small>
              )}
            </div>
          ))}
          <button
            className="store-button"
            disabled={password.formState.isSubmitting}
          >
            {password.formState.isSubmitting ? (
              <IconLoader2 size={18} className="animate-spin" />
            ) : (
              <IconLockFilled size={18} />
            )}
            Change Password
          </button>
        </form>
      </section>
    </AccountShell>
  );
}
