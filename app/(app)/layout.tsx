import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppSidebar from "@/layout/AppSidebar";
import MobileTopbar from "@/layout/MobileTopbar";
import MobileNav from "@/layout/MobileNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileTopbar />
        <main className="flex-1 overflow-y-auto pb-28 lg:pb-0">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
