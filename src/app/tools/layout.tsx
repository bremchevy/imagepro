export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 pb-32 min-h-screen">
      {children}
    </div>
  );
} 