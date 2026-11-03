"use client";

import { useState } from "react";
import { SparkleBullet } from "@/components/ui/SparkleDivider";
import { EditableImage } from "@/components/edit/EditableImage";
import { EditableText } from "@/components/edit/EditableText";
import { AddItemButton } from "@/components/edit/EditableListControls";
import { useEditMode } from "@/lib/edit-mode";
import { updateVenueContent, uploadImage } from "@/lib/admin-data";
import type { VenueContent } from "@/lib/types";

export function TheSpace({ venue: initial }: { venue: VenueContent }) {
  const { editMode } = useEditMode();
  const [venue, setVenue] = useState(initial);
  const photos = venue.gallery.length ? venue.gallery : Array(6).fill(undefined);

  function patch(data: Partial<VenueContent>) {
    setVenue((v) => ({ ...v, ...data }));
    return updateVenueContent(data);
  }

  async function handleGalleryChange(i: number, src: string) {
    const gallery = [...venue.gallery];
    gallery[i] = src;
    await patch({ gallery });
  }

  async function handleAddPhoto(file: File) {
    const url = await uploadImage(file, "venue/gallery");
    await patch({ gallery: [...venue.gallery, url] });
  }

  function patchAmenity(i: number, value: string) {
    const amenities = venue.amenities.map((a, idx) => (idx === i ? value : a));
    return patch({ amenities });
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid grid-cols-3 gap-3">
        {photos.slice(0, 6).map((src: string | undefined, i: number) => (
          <EditableImage
            key={i}
            src={src}
            alt="The venue"
            seed={i}
            pathPrefix="venue/gallery"
            onSave={(url) => handleGalleryChange(i, url)}
            className="aspect-square rounded-lg"
          />
        ))}
        {editMode ? (
          <label className="focus-ring flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-hot/40 font-display text-xs font-bold text-hot hover:border-hot">
            + Add photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAddPhoto(file);
              }}
            />
          </label>
        ) : null}
      </div>
      <div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">The space</h2>
        <EditableText
          value={venue.intro}
          onSave={(v) => patch({ intro: v })}
          multiline
          as="p"
          className="mt-3 block text-paper-dim"
        />
        <div className="mt-6 flex gap-8">
          <div>
            <EditableText
              value={String(venue.capacityStanding)}
              onSave={(v) => patch({ capacityStanding: Number(v) || 0 })}
              type="number"
              as="p"
              className="font-display text-3xl font-bold text-hot-bright"
            />
            <p className="text-xs uppercase tracking-wide text-paper-dim">Standing</p>
          </div>
          <div>
            <EditableText
              value={String(venue.capacitySeated)}
              onSave={(v) => patch({ capacitySeated: Number(v) || 0 })}
              type="number"
              as="p"
              className="font-display text-3xl font-bold text-hot-bright"
            />
            <p className="text-xs uppercase tracking-wide text-paper-dim">Seated</p>
          </div>
        </div>
        <h3 className="mt-6 font-display text-sm font-bold uppercase tracking-wide text-paper">Amenities</h3>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {venue.amenities.map((a, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-paper-dim">
              <SparkleBullet />
              {editMode ? (
                <div className="flex flex-1 items-center gap-1">
                  <EditableText value={a} onSave={(v) => patchAmenity(i, v)} className="flex-1" />
                  <button
                    type="button"
                    onClick={() => patch({ amenities: venue.amenities.filter((_, idx) => idx !== i) })}
                    className="focus-ring text-paper-dim hover:text-hot-bright"
                    aria-label="Remove amenity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                a
              )}
            </li>
          ))}
        </ul>
        {editMode ? (
          <AddItemButton
            onClick={() => patch({ amenities: [...venue.amenities, "New amenity"] })}
            label="Add amenity"
            className="mt-3 w-full py-2"
          />
        ) : null}
      </div>
    </div>
  );
}
