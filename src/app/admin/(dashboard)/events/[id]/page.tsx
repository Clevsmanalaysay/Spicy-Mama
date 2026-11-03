"use client";

import { use, useEffect, useState } from "react";
import { Sparkle } from "lucide-react";
import { EventForm } from "@/components/admin/EventForm";
import { getEventAdmin } from "@/lib/admin-data";
import type { SpicyEvent } from "@/lib/types";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [event, setEvent] = useState<SpicyEvent | null | undefined>(undefined);

  useEffect(() => {
    getEventAdmin(id).then(setEvent);
  }, [id]);

  if (event === undefined) {
    return <Sparkle className="size-6 animate-sparkle fill-hot-deep text-hot-deep" aria-hidden="true" />;
  }

  if (event === null) {
    return <p className="text-ink/60">Event not found.</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Edit event</h1>
      <div className="mt-6">
        <EventForm eventId={id} initial={event} />
      </div>
    </div>
  );
}
