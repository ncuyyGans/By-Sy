import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Sy — personal notes",
  description: "Cerita, pemikiran, dan catatan belajar dari Sy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
