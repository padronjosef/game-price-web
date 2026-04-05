"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/shared/UI/Button";

type ViewToggleProps = {
  value: "grid" | "list";
  onChange: (mode: "grid" | "list") => void;
}

export const ViewToggle = ({ value, onChange }: ViewToggleProps) => {
  const isGrid = value === "grid";

  return (
    <Button
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        onChange(isGrid ? "list" : "grid");
      }}
      variant="outline"
      className="relative size-10 p-0 rounded"
    >
      <LayoutGrid
        className={`absolute size-5 transition-all duration-300 ${
          isGrid ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-90"
        }`}
      />
      <List
        className={`absolute size-5 transition-all duration-300 ${
          isGrid ? "opacity-0 scale-75 -rotate-90" : "opacity-100 scale-100 rotate-0"
        }`}
      />
    </Button>
  );
};
