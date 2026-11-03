import { PlaceholderMedia } from "@/components/ui/PlaceholderMedia";

export function StillsGallery({ images, title }: { images: string[]; title: string }) {
  const slots = images.length ? images : [undefined, undefined, undefined, undefined];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {slots.map((src, i) => (
        <PlaceholderMedia
          key={i}
          src={src}
          alt={`${title} still ${i + 1}`}
          seed={i + 3}
          className="aspect-[4/5] rounded-lg"
        />
      ))}
    </div>
  );
}
