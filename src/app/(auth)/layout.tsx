export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-dark flex items-center justify-center overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid" />

      {/* Decorative gradient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-mint/[0.04] blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {children}
      </div>
    </div>
  );
}
