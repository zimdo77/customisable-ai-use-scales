// uses <SidebarNav/> (Home, CUS Library, USL Library, Profile)
import SidebarNav from '@/components/shared/SidebarNav';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarNav />
      <main className="ml-56 min-h-screen">{children}</main>
    </div>
  );
}
