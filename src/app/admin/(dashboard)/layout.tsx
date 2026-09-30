"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  User,
  Briefcase,
  Mail,
  Settings,
  LogOut,
  Images,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { cn } from "@/components/lib/utils";
import { useAdminInbox, useAdminAbout } from "../../../services/adminService";
import { useAdminLogout } from "../../../services/authService";
import {
  BG,
  SURFACE,
  BORDER,
  ACCENT,
  MUTED,
  TEXT,
  mono,
  heading,
  body,
} from "../../../components/admin/adminUi";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/resume", label: "Resume", icon: Briefcase },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/inbox", label: "Inbox", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logout = useAdminLogout();
  const { data: inboxMsgs = [] } = useAdminInbox();
  const unread = inboxMsgs.filter((m) => !m.read).length;
  const { data: profile, isLoading: profileLoading } = useAdminAbout();

  const activeItem = navItems.find((n) =>
    n.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(n.href),
  );

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: BG, color: TEXT, fontFamily: body }}
    >
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        pathname={pathname}
        sidebarOpen={sidebarOpen}
        profile={profile}
        profileLoading={profileLoading}
        unread={unread}
        navItems={navItems}
        router={router}
        logout={logout}
      />

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 sm:px-8 py-4 border-b sticky top-0 z-10"
          style={{ background: SURFACE, borderColor: BORDER }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-[8px] transition-colors duration-150"
              style={{ color: MUTED }}
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} strokeWidth={1.6} />
            </button>
            <div
              className="text-[19px] font-semibold leading-tight"
              style={{
                fontFamily: heading,
                letterSpacing: "-0.025em",
                color: TEXT,
              }}
            >
              {activeItem?.label}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-auto rounded-[10px] border-border bg-transparent px-4 py-[7px] font-mono text-[12px] font-normal text-[#A1A1AA] hover:text-[#EDEDEF]"
            >
              <Link href="/">View site ↗</Link>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}

function Sidebar({
  pathname,
  sidebarOpen,
  profile,
  profileLoading,
  unread,
  navItems,
  router,
  logout,
}) {
  return (
    <aside
      className={cn(
        "w-[220px] shrink-0 flex flex-col border-r",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: BORDER }}>
        <Link href="/">
          <img src="/favicon.ico" alt="logo" className="w-8 h-8 mb-[6px]" />
          <div
            className="text-[11px]"
            style={{ fontFamily: mono, color: MUTED }}
          >
            biraj / admin
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "h-auto w-full justify-start gap-3 rounded-[10px] px-3 py-[9px] font-mono text-[13px] font-normal",
                isActive
                  ? "bg-[#FF6B6B]/[0.06] text-[#FF6B6B] hover:bg-[#FF6B6B]/[0.06] hover:text-[#FF6B6B]"
                  : "text-[#6E6E78] hover:bg-white/[0.04] hover:text-[#A1A1AA]",
              )}
            >
              <Link href={item.href}>
                <item.icon size={15} strokeWidth={1.6} />
                {item.label}
                {item.href === "/admin/inbox" && unread > 0 && (
                  <Badge className="ml-auto px-[7px] py-[2px] text-[9.5px] font-normal text-[#111]">
                    {unread}
                  </Badge>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Bottom: avatar + back to site */}
      <div className="px-3 py-4 border-t" style={{ borderColor: BORDER }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden">
            {profileLoading ? (
              <div className="w-full h-full rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
            ) : profile?.avatarImage ? (
              <img
                src={profile.avatarImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[12px] font-bold"
                style={{ background: `${ACCENT}22`, color: ACCENT }}
              >
                {profile?.name?.[0]?.toUpperCase() ?? "B"}
              </div>
            )}
          </div>
          <div>
            {profileLoading ? (
              <div className="h-3 w-20 rounded animate-pulse mb-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            ) : (
              <div className="text-[12.5px] font-medium" style={{ color: TEXT }}>
                {profile?.name ?? "Biraj"}
              </div>
            )}
            {profileLoading ? (
              <div className="h-2.5 w-10 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
            ) : (
              <div className="text-[10.5px]" style={{ fontFamily: mono, color: MUTED }}>
                admin
              </div>
            )}
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          className="h-auto w-full justify-start gap-2 rounded-[10px] px-3 py-[8px] font-mono text-[12px] font-normal text-[#6E6E78] hover:bg-transparent hover:text-[#A1A1AA]"
        >
          <Link href="/">← back to site</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            logout();
            router.replace("/admin/login");
            router.refresh();
          }}
          className="h-auto w-full justify-start gap-2 rounded-[10px] px-3 py-[8px] font-mono text-[12px] font-normal text-[#6E6E78] hover:bg-transparent hover:text-destructive"
        >
          <LogOut size={13} strokeWidth={1.7} />
          sign out
        </Button>
      </div>
    </aside>
  );
}
