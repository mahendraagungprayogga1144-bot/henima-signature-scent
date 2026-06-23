import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Chat - Henima Signature Scent",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
