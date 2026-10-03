import Link from "next/link";
import type { ReactNode } from "react";
export default function StoreHeading({
  title,
  subtitle,
  icon,
  breadcrumb,
  banner = false,
  purple = false,
  action,
}: {
  title: string;
  subtitle?: ReactNode;
  icon: ReactNode;
  breadcrumb?: string;
  banner?: boolean;
  purple?: boolean;
  action?: ReactNode;
}) {
  return (
    <header
      className={`store-heading ${banner ? "store-banner" : ""} ${purple ? "store-purple" : ""}`}
    >
      <div className="store-container">
        <nav className="store-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span aria-current="page">{breadcrumb || title}</span>
        </nav>
        <div className="store-title-row">
          <span className="store-title-icon" aria-hidden="true">
            {icon}
          </span>
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action && <div className="store-heading-action">{action}</div>}
        </div>
      </div>
    </header>
  );
}
