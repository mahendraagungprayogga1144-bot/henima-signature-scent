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
  return (
    <>
      <style>{`
        body { overflow: hidden !important; }
        header, footer, .henima-chat-btn { display: none !important; }
      `}</style>
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#FAF8F4",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {children}
      </div>
    </>
  );
}
