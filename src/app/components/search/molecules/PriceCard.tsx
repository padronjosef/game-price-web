"use client";

import { GameCard } from "@/app/components/shared/molecules/GameCard";
import { StoreIcon } from "@/app/components/shared/atoms/StoreIcon";
import type { PriceResult } from "@/shared/lib/stores";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "Updated just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `Updated ${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours}h ago`;
  return `Updated ${Math.floor(hours / 24)}d ago`;
}

type PriceCardProps = {
  price: PriceResult;
  index: number;
  displayPrice: (amount: number, from?: string) => string;
  variant?: "grid" | "list";
}

export const PriceCard = ({
  price,
  index,
  displayPrice,
  variant = "grid",
}: PriceCardProps) => {
  const badges = [];
  if (price.gameType === "dlc")
    badges.push({ label: "DLC", className: "bg-orange-500" });
  if (price.gameType === "bundle")
    badges.push({ label: "Bundle", className: "bg-purple-500" });
  const priceCurrency = price.currency || "USD";
  const sName = price.store?.name || price.storeName || "";


  const hasDiscount = price.originalPrice && price.originalPrice > price.price;
  const discountPct = hasDiscount
    ? `-${Math.round((1 - price.price / price.originalPrice!) * 100)}%`
    : undefined;

  return (
    <GameCard
      href={price.productUrl}
      image={price.imageUrl}
      name={price.gameName}
      badges={badges}
      variant={variant}
      priority={index < 6}
      storeIcon={<StoreIcon storeName={sName} />}
      storeName={sName}
      discount={discountPct}
      updatedAt={price.scrapedAt ? timeAgo(price.scrapedAt) : undefined}
      price={
        <span className={index === 0 ? "text-primary" : "text-foreground"}>
          {displayPrice(Number(price.price), priceCurrency)}
        </span>
      }
      originalPrice={
        hasDiscount
          ? displayPrice(Number(price.originalPrice), priceCurrency)
          : undefined
      }
    />
  );
};
