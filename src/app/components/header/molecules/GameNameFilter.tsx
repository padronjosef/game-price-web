"use client";

import { useState } from "react";
import { Collapse } from "@/app/components/shared/atoms/Collapse";
import { Button } from "@/shared/UI/Button";
import { ChevronDown } from "lucide-react";
import { useResultCount } from "@/shared/stores/selectors";

type GameNameFilterProps = {
  gameNames: string[];
  activeFilter: string;
  onFilterChange: (name: string) => void;
};

export const GameNameFilter = ({
  gameNames,
  activeFilter,
  onFilterChange,
}: GameNameFilterProps) => {
  const resultCount = useResultCount();
  const [expanded, setExpanded] = useState(false);

  if (gameNames.length <= 1 && !resultCount) return null;

  const select = (name: string) => {
    onFilterChange(name);
    setExpanded(false);
  };

  return (
    <>
      {/* Trigger row */}
      <div className="flex items-center gap-2">
        {resultCount !== undefined && (
          <Button variant="default" className="pointer-events-none">
            {resultCount} Results
          </Button>
        )}

        {gameNames.length > 1 && (
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
          >
            {activeFilter === "all" ? "All Games" : activeFilter}
            <ChevronDown
              className={`size-3 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </Button>
        )}
      </div>

      {/* Collapse - rendered via portal-like pattern in parent */}
      {gameNames.length > 1 && (
        <Collapse
          open={expanded}
          maxHeight="300px"
          className="w-full mt-2 order-last"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-2 bg-muted border border-border rounded-lg">
            <Button
              onClick={() => select("all")}
              variant={activeFilter == "all" ? "default" : "outline"}
            >
              All Games
            </Button>

            {gameNames.map((name) => (
              <Button
                key={name}
                onClick={() => select(name)}
                variant={activeFilter === name ? "default" : "outline"}
                className="min-w-0 overflow-hidden"
              >
                <span className="truncate">{name}</span>
              </Button>
            ))}
          </div>
        </Collapse>
      )}
    </>
  );
};
