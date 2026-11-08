import { Camera, Clapperboard, Megaphone, Music, PartyPopper, Sparkle } from "lucide-react";
import type { WhatWeDoIconKey } from "./types";

export const whatWeDoIconMap: Record<WhatWeDoIconKey, typeof Clapperboard> = {
  film: Clapperboard,
  megaphone: Megaphone,
  party: PartyPopper,
  camera: Camera,
  music: Music,
  sparkle: Sparkle,
};

export const whatWeDoIconOptions: { value: WhatWeDoIconKey; label: string }[] = [
  { value: "film", label: "Film reel" },
  { value: "megaphone", label: "Megaphone" },
  { value: "party", label: "Party popper" },
  { value: "camera", label: "Camera" },
  { value: "music", label: "Music note" },
  { value: "sparkle", label: "Sparkle" },
];
