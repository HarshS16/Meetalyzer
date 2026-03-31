"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import { DashboardCommand } from "./dashboard-command";
import { useEffect, useState } from "react";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

      <nav
        className="flex items-center gap-2 px-4 py-3 glass border border-primary/20 rounded-2xl max-sm:px-2 max-sm:py-2"
        suppressHydrationWarning
      >
        <Button
          className="size-9 border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-white transition-all"
          variant="outline"
          onClick={toggleSidebar}
          suppressHydrationWarning
        >
          {mounted && (state === "collapsed" || isMobile) ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>

        <Button
          className="flex items-center h-9 w-full max-w-[400px] justify-start font-normal text-gray-400 hover:text-white border-primary/30 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all max-sm:justify-center max-sm:max-w-[48px] max-sm:px-0"
          variant="outline"
          onClick={() => setCommandOpen((o) => !o)}
          suppressHydrationWarning
        >
          <SearchIcon className="size-4 mr-2 max-sm:mr-0" />

          {/* Hide text & kbd on mobile */}
          <span className="flex-1 text-left max-sm:hidden">Search...</span>

          <kbd
            className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 border border-primary/30 bg-white/10 px-1.5 font-mono text-[10px] text-gray-300 rounded max-sm:hidden"
            suppressHydrationWarning
          >
            ⌘ K
          </kbd>
        </Button>
      </nav>
    </>
  );
};
