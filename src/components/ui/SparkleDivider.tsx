import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SparkleDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-hot", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <Sparkle className="size-4 fill-hot" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function SparkleBullet({ className }: { className?: string }) {
  return <Sparkle className={cn("size-3.5 shrink-0 fill-hot text-hot", className)} aria-hidden="true" />;
}
