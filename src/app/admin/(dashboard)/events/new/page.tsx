import { EventForm } from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">New event</h1>
      <p className="mt-1 text-ink/60">Fill this in, then save as a draft or publish.</p>
      <div className="mt-6">
        <EventForm eventId={null} />
      </div>
    </div>
  );
}
