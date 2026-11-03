"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/types";

export function Faq({ items }: { items: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : item.id)}
              className="focus-ring flex w-full items-center justify-between gap-4 py-5 text-left"
              aria-expanded={open}
            >
              <span className="font-display text-base font-bold text-paper sm:text-lg">{item.question}</span>
              <ChevronDown
                className={cn("size-5 shrink-0 text-hot transition-transform", open && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {open ? <p className="pb-5 text-sm text-paper-dim sm:text-base">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
