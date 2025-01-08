export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
      {children}
    </div>
  );
}
