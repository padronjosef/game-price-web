"use client";

import { useState } from "react";
import { ChevronIcon } from "./ChevronIcon";
import { Collapse } from "./Collapse";

type ExpandableProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  leftSlot?: React.ReactNode;
  onLeftSlotClick?: () => void;
  rightSlot?: React.ReactNode;
  compact?: boolean;
};

export const Expandable = ({
  title,
  children,
  defaultOpen = false,
  leftSlot,
  onLeftSlotClick,
  rightSlot,
  compact = false,
}: ExpandableProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <div className="w-full flex items-center py-1 cursor-pointer" onClick={() => setOpen((v) => !v)}>
        {leftSlot ? (
          <div
            onClick={(e) => { e.stopPropagation(); onLeftSlotClick?.(); }}
            className="flex items-center gap-2 cursor-pointer"
          >
            {leftSlot}
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {title}
            </span>
          </div>
        ) : (
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            {title}
          </span>
        )}
        <div className={`flex items-center gap-1 ${compact ? "" : "ml-auto"}`}>
          {rightSlot}
          <ChevronIcon open={open} />
        </div>
      </div>
      <Collapse open={open} maxHeight="1000px" duration={300}>
        <div className="pt-2">
          {children}
        </div>
      </Collapse>
    </div>
  );
};
