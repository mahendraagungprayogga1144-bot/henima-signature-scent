export default function KatalogDigitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ width: "100%", margin: 0, padding: 0, overflow: "visible" }}>
      {children}
    </div>
  );
}
