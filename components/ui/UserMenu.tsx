"use client";

/* -------------------------------------------------------------------------- */
/*                              USER MENU                                     */
/* -------------------------------------------------------------------------- */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  User,
  LogOut,
  ChevronDown,
  Shield,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import { Avatar } from "@/components/ui/UserAvatar";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface UserMenuProps {
  align?: "left" | "right";
}

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

export function UserMenu({
  align = "right",
}: UserMenuProps) {
  const {
    user,
    signOut,
  } = useAuth();

  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------------- */
  /*                          OUTSIDE CLICK                                 */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function onClickOutside(
      e: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      onClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        onClickOutside,
      );
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                            ESC CLOSE                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function onKey(
      e: KeyboardEvent,
    ) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      onKey,
    );

    return () =>
      document.removeEventListener(
        "keydown",
        onKey,
      );
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                              GUARD                                     */
  /* ---------------------------------------------------------------------- */

  if (!user) {
    return null;
  }

  /* ---------------------------------------------------------------------- */
  /*                            MENU ITEMS                                  */
  /* ---------------------------------------------------------------------- */

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      href: "/settings",
      description:
        "Manage your personal profile",
    },
  ];

  /* ---------------------------------------------------------------------- */
  /*                              LOGOUT                                    */
  /* ---------------------------------------------------------------------- */

  async function handleLogout() {
    setOpen(false);

    await signOut();

    router.push("/");

    router.refresh();
  }

  /* ---------------------------------------------------------------------- */
  /*                                UI                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* TRIGGER */}

      <button
        onClick={() =>
          setOpen((o) => !o)
        }
        aria-expanded={open}
        aria-haspopup="true"
        className="group flex items-center gap-2.5 rounded-2xl border border-[#E8DED5]/80 bg-white/75 px-3 py-1.5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#D4B9A2] hover:bg-white hover:shadow-[0_10px_30px_rgba(91,63,43,0.08)]"
      >
        {/* Avatar */}

        <Avatar
          initials={user.initials}
          avatarUrl={
            user.avatarUrl
          }
          size="sm"
        />

        {/* User Info */}

        <div className="hidden flex-col items-start sm:flex">
          <span className="max-w-[120px] truncate text-xs font-semibold leading-tight text-[#4B3326]">
            {user.fullName}
          </span>

          <span className="text-[10px] leading-tight text-[#9A8475]">
            Founding Member
          </span>
        </div>

        {/* Chevron */}

        <ChevronDown
          size={14}
          className={`hidden text-[#9A8475] transition-transform duration-300 sm:block ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
            }}
            className={`absolute top-full z-50 mt-3 w-72 overflow-hidden rounded-[1.8rem] border border-[#E8DED5]/80 bg-[rgba(255,252,249,0.92)] shadow-[0_30px_80px_rgba(91,63,43,0.16)] backdrop-blur-2xl ${
              align === "right"
                ? "right-0"
                : "left-0"
            }`}
          >
            {/* Ambient Glow */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#F5ECE3]/70 blur-3xl" />

              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-[#EFE4D8]/60 blur-3xl" />
            </div>

            {/* HEADER */}

            <div className="relative border-b border-[#F0E8E0]/80 px-5 py-5">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={
                    user.initials
                  }
                  avatarUrl={
                    user.avatarUrl
                  }
                  size="md"
                />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#4B3326]">
                    {user.fullName}
                  </p>

                  <p className="truncate text-xs text-[#9A8475]">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* MENU */}

            <div className="relative p-2">
              {menuItems.map(
                ({
                  icon: Icon,
                  label,
                  href,
                  description,
                }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() =>
                      setOpen(false)
                    }
                    className="group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-300 hover:bg-[#F8F1EA]/90"
                  >
                    {/* Icon */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE5] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#E8DED5]">
                      <Icon
                        size={16}
                        className="text-[#7A553D]"
                      />
                    </div>

                    {/* Text */}

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#4B3326]">
                        {label}
                      </p>

                      <p className="truncate text-xs text-[#9A8475]">
                        {
                          description
                        }
                      </p>
                    </div>
                  </Link>
                ),
              )}
            </div>

            {/* FOOTER */}

            <div className="relative border-t border-[#F0E8E0]/80 p-2">
              <button
                onClick={
                  handleLogout
                }
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-300 hover:bg-red-50"
              >
                {/* Icon */}

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3ECE5] transition-all duration-300 group-hover:bg-red-100">
                  <LogOut
                    size={16}
                    className="text-[#7A553D] transition-colors duration-300 group-hover:text-red-600"
                  />
                </div>

                {/* Text */}

                <div className="text-left">
                  <p className="text-sm font-medium text-[#4B3326] transition-colors duration-300 group-hover:text-red-600">
                    Sign Out
                  </p>

                  <p className="text-xs text-[#9A8475]">
                    End your wellness session
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}