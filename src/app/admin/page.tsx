import type { Metadata } from "next";
import { AdminPanel } from "@/features/admin/components/admin-panel";

export const metadata: Metadata = {
  title: "Admin, Páginas VIP",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
