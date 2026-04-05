"use client";

import { Button } from "@/shared/UI/Button";
import { Flame } from "lucide-react";

type CheapestButtonProps = {
  active: boolean;
  onClick: () => void;
  className?: string;
};

export const CheapestButton = ({
  active,
  onClick,
  className = "",
}: CheapestButtonProps) => {
  return (
    <Button variant={active ? "default" : "outline"} onClick={onClick} className={`w-fit shrink-0 ${className}`}>
      <Flame className="size-4" />
      Cheapest only
    </Button>
  );
};
