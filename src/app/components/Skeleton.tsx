interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-zinc-800 rounded-lg animate-pulse ${className}`} />
  );
}
