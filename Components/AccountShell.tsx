import Link from "next/link";
import {
  IconUserFilled,
  IconMapPinFilled,
  IconSettingsFilled,
  IconChevronRight,
} from "@tabler/icons-react";
import StoreHeading from "./StoreHeading";
import type { ReactNode } from "react";
export default function AccountShell({
  children,
  active,
}: {
  children: ReactNode;
  active: "addresses" | "settings";
}) {
  return (
    <div className="store-screen store-account">
      <StoreHeading
        title="My Account"
        subtitle="Manage your addresses and account settings"
        icon={<IconUserFilled size={32} />}
        banner
      />
      <div className="store-container account-layout">
        <aside className="store-card account-sidebar">
          <h2>My Account</h2>
          {[
            ["addresses", "/addresses", "My Addresses", IconMapPinFilled],
            ["settings", "/account/settings", "Settings", IconSettingsFilled],
          ].map(([key, href, label, Icon]) => {
            const ItemIcon = Icon as typeof IconMapPinFilled;
            return (
              <Link
                key={key as string}
                href={href as string}
                className={active === key ? "active" : ""}
              >
                <span>
                  <ItemIcon size={20} />
                </span>
                {label as string}
                <IconChevronRight size={16} />
              </Link>
            );
          })}
        </aside>
        <div className="account-content">{children}</div>
      </div>
    </div>
  );
}
