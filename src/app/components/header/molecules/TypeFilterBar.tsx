"use client";

import { Button } from "@/shared/UI/Button";
import { TYPE_LABELS, type TypeFilter } from "@/shared/lib/stores";

type TypeFilterBarProps = {
  value: TypeFilter;
  onChange: (type: TypeFilter) => void;
  className?: string;
};

export const TypeFilterBar = ({
  value,
  onChange,
  className = "",
}: TypeFilterBarProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {(Object.keys(TYPE_LABELS) as TypeFilter[]).map((type) => (
        <Button
          key={type}
          variant={value === type ? "default" : "outline"}
          onClick={() => onChange(type)}
        >
          {TYPE_LABELS[type]}
        </Button>
      ))}
    </div>
  );
};
