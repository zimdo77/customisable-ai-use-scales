// uses <SidebarNav/> (Home, CUS Library, USL Library, Profile)
import SidebarNav from '@/components/shared/SidebarNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarNav />

      {/* Page content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
