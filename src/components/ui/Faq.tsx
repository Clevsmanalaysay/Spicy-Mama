"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton, RemoveItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { deleteFaqItem, saveFaqItem } from "@/lib/admin-data";
import type { FaqItem } from "@/lib/types";

export function Faq({ items: initial }: { items: FaqItem[] }) {
  const { editMode } = useEditMode();
  const [items, setItems] = useState(initial);
  const [openId, setOpenId] = useState<string | null>(initial[0]?.id ?? null);

  async function handleAdd() {
    const order = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;
    const id = await saveFaqItem(null, { question: "New question", answer: "New answer", order });
    setItems((list) => [...list, { id, question: "New question", answer: "New answer", order }]);
  }

  async function handleRemove(id: string) {
    await deleteFaqItem(id);
    setItems((list) => list.filter((i) => i.id !== id));
  }

  function patch(id: string, data: Partial<FaqItem>) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...data } : i)));
    return saveFaqItem(id, { ...items.find((i) => i.id === id)!, ...data });
  }

  return (
    <div>
      <div className="divide-y divide-line border-y border-line">
        {items.map((item) => {
          const open = editMode || openId === item.id;
          return (
            <div key={item.id} className="relative">
              {editMode ? (
                <div className="py-5">
                  <RemoveItemButton onClick={() => handleRemove(item.id)} label={`Remove question "${item.question}"`} />
                  <EditableText
                    value={item.question}
                    onSave={(v) => patch(item.id, { question: v })}
                    className="block font-display text-base font-bold text-paper sm:text-lg"
                  />
                  <EditableText
                    value={item.answer}
                    onSave={(v) => patch(item.id, { answer: v })}
                    multiline
                    className="mt-2 block text-sm text-paper-dim sm:text-base"
                  />
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          );
        })}
      </div>
      {editMode ? <AddItemButton onClick={handleAdd} label="Add question" className="mt-4 w-full" /> : null}
    </div>
  );
}
