"use client";

import { useState, type ReactNode } from "react";
import { AppTopbar } from "./app-topbar";
import { AppMenuDrawer } from "./app-menu-drawer";
import { GalleryDrawer } from "./gallery-drawer";
import { WelcomeTour } from "./welcome-tour";
import { WhatsappFab } from "@/features/landing/components/whatsapp-fab";
import { useMySongs } from "../use-my-songs";

/** Casca do app (criar): topbar + menu + galeria ao redor do conteúdo. */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const songs = useMySongs();

  return (
    <div className="min-h-dvh">
      <AppTopbar
        count={songs.length}
        onOpenGallery={() => setGalleryOpen(true)}
        onOpenMenu={() => setMenuOpen(true)}
      />
      {children}
      <WhatsappFab />
      <AppMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <GalleryDrawer open={galleryOpen} onClose={() => setGalleryOpen(false)} songs={songs} />
      <WelcomeTour />
    </div>
  );
}
