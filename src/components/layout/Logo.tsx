import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, height = 40 }: { className?: string; height?: number }) {
  return (
    <Link href="/" className={cn("focus-ring group shrink-0", className)}>
      <span className="relative block" style={{ height, width: height * (680 / 252) }}>
        <Image
          src="/brand/logo.png"
          alt="Spicy Mama Creative Studio"
          fill
          className="object-contain transition-transform group-hover:scale-105"
          priority
        />
      </span>
    </Link>
  );
}
