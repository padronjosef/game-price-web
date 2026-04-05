"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useUIStore } from "@/shared/stores/useUIStore";
import { useSearchStore } from "@/shared/stores/useSearchStore";

type ResultsToastProps = {
  scraping: boolean;
  visible: boolean;
};

export const ResultsToast = ({
  scraping,
  visible,
}: ResultsToastProps) => {
  const scrapingStores = useSearchStore((s) => s.scrapingStores);
  const isShowing = visible && scraping;

  useEffect(() => {
    useUIStore.setState({ toastVisible: isShowing });
  }, [isShowing]);

  if (!isShowing) return null;

  return (
    <div className="fixed bottom-2 md:bottom-6 left-0 right-0 z-200 flex justify-center pointer-events-none transition-all duration-300">
      <div className="w-full max-w-5xl px-4 flex justify-end pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5 shadow-2xl text-sm text-muted-foreground border-loading">
          <span className="font-bold whitespace-nowrap bg-gradient-to-r from-[#22c55e] via-[#00e0fd] to-[#22c55e] bg-[length:200%_100%] bg-clip-text text-transparent animate-[border-spin_1.5s_linear_infinite]">
            Scraping{scrapingStores.size > 0 && ` ${[...scrapingStores].join(", ")}`}
          </span>
          <Loader2 className="size-4 animate-spin text-[#22c55e]" />
        </div>
      </div>
    </div>
  );
};
