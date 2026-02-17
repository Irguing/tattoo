export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  // ✅ Login NO debe heredar AdminShell
  return <>{children}</>;
}
