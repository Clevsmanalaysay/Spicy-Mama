/** Turns a YouTube/Vimeo/Instagram link into its embeddable iframe URL, or null if it's not one (e.g. a direct video file link/upload — play that with a <video> tag instead). */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://player.vimeo.com/video/${id}?autoplay=1` : null;
    }
    if (u.hostname.includes("instagram.com")) {
      const match = u.pathname.match(/^\/(p|reel|tv)\/([^/]+)/);
      return match ? `https://www.instagram.com/${match[1]}/${match[2]}/embed` : null;
    }
    return null;
  } catch {
    return null;
  }
}
