"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [menu, setMenu] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] border-b border-white/[0.06] bg-[#070908]/80 backdrop-blur-2xl">

      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* ==================================================
            BRAND
        ================================================== */}

        <Link
          href="/"
          className="group flex items-center gap-3"
        >

          {/* LOGO */}

          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden">

            <Image
              src="/bhoomisetu-logo.png"
              alt="BhoomiSetu"
              width={120}
              height={120}
              priority
              className="h-[90px] w-[90px] max-w-none object-contain"
            />

          </div>

          {/* SEPARATE NAME */}

          <div>

            <div className="text-[13px] tracking-[0.32em] text-white">
              BHOOMISETU
            </div>

            <div className="mt-1 text-[7px] uppercase tracking-[0.28em] text-white/25">
              Land Intelligence
            </div>

          </div>

        </Link>


        {/* ==================================================
            DESKTOP NAV
        ================================================== */}

        <nav className="hidden items-center gap-7 lg:flex">

          <NavLink href="/">
            Home
          </NavLink>

          <NavLink href="/explore">
            Explore
          </NavLink>

          <NavLink href="/intelligence">
            Intelligence
          </NavLink>

          <NavLink href="/how-it-works">
            How it works
          </NavLink>

          <NavLink href="/investment">
            Investment
          </NavLink>

          <NavLink href="/about">
            About
          </NavLink>

          <NavLink href="/contact">
            Contact
          </NavLink>

          <Link
            href="/signup"
            className="rounded-full border border-white/10 px-5 py-2.5 text-[8px] uppercase tracking-[0.18em] text-white/50 transition hover:border-white/30 hover:text-white"
          >
            Sign in
          </Link>

        </nav>


        {/* ==================================================
            MOBILE
        ================================================== */}

        <button
          type="button"
          onClick={() => setMenu(!menu)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 lg:hidden"
        >
          <div className="space-y-1">

            <span className="block h-px w-4 bg-white/50" />

            <span className="block h-px w-4 bg-white/50" />

          </div>
        </button>

      </div>


      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      {menu && (

        <div className="border-t border-white/[0.06] bg-[#070908]/98 px-5 py-6 lg:hidden">

          <div className="flex flex-col gap-5">

            <MobileLink
              href="/"
              onClick={() => setMenu(false)}
            >
              Home
            </MobileLink>

            <MobileLink
              href="/explore"
              onClick={() => setMenu(false)}
            >
              Explore
            </MobileLink>

            <MobileLink
              href="/intelligence"
              onClick={() => setMenu(false)}
            >
              Intelligence
            </MobileLink>

            <MobileLink
              href="/how-it-works"
              onClick={() => setMenu(false)}
            >
              How it works
            </MobileLink>

            <MobileLink
              href="/investment"
              onClick={() => setMenu(false)}
            >
              Investment
            </MobileLink>

            <MobileLink
              href="/about"
              onClick={() => setMenu(false)}
            >
              About
            </MobileLink>

            <MobileLink
              href="/contact"
              onClick={() => setMenu(false)}
            >
              Contact
            </MobileLink>

            <MobileLink
              href="/signup"
              onClick={() => setMenu(false)}
            >
              Sign in
            </MobileLink>

          </div>

        </div>

      )}

    </header>
  );
}


function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[8px] uppercase tracking-[0.18em] text-white/30 transition hover:text-white"
    >
      {children}
    </Link>
  );
}


function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-[10px] uppercase tracking-[0.2em] text-white/50"
    >
      {children}
    </Link>
  );
}