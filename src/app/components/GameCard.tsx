"use client";

import { useState } from "react";

function ImageFallback() {
  return (
    <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-zinc-600">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="9" cy="12" r="2" />
        <path d="M15 10v4M13 12h4" />
      </svg>
    </div>
  );
}

interface Badge {
  label: string;
  className: string;
}

interface GameCardProps {
  href: string;
  image: string;
  name: string;
  badges?: Badge[];
  storeIcon?: React.ReactNode;
  bottomRight?: React.ReactNode;
  highlight?: boolean;
}

export function GameCard({
  href,
  image,
  name,
  badges,
  storeIcon,
  bottomRight,
  highlight = false,
}: GameCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between rounded-lg border border-zinc-700/50 overflow-hidden h-[190px] cursor-pointer"
    >
      {!image || imgError ? (
        <ImageFallback />
      ) : (
        <img
          src={image}
          alt={name}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.9] group-hover:brightness-[0.95] group-hover:scale-105 transition-all duration-500 ease-out"
        />
      )}
      <div className="relative p-3">
        <span className="bg-black/70 text-white text-sm font-bold px-2 py-1 rounded leading-snug line-clamp-2 block w-fit">
          {name}
        </span>
      </div>
      <div className="relative p-3 flex items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          {storeIcon}
          {badges?.map((b) => (
            <span key={b.label} className={`text-sm px-2 py-0.5 rounded text-white font-medium ${b.className}`}>
              {b.label}
            </span>
          ))}
        </div>
        {bottomRight}
      </div>
    </a>
  );
}

export function SkeletonCard() {
  return (
    <div className="relative flex flex-col justify-between rounded-lg border border-zinc-700/50 overflow-hidden h-[190px] animate-skeleton">
      <div className="absolute inset-0 bg-zinc-800" />
      <div className="relative p-3">
        <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
      </div>
      <div className="relative p-3 flex items-end justify-between">
        <div className="h-5 w-5 bg-zinc-700 rounded" />
        <div className="h-5 bg-zinc-700 rounded w-16" />
      </div>
    </div>
  );
}
