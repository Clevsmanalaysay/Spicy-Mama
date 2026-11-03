import type { MetadataRoute } from "next";
import { getEvents, getProjects } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spicymamastudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, events] = await Promise.all([getProjects(), getEvents()]);

  const staticRoutes = ["", "/work", "/studio", "/venue", "/events", "/about", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((p) => ({
    url: `${siteUrl}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  const eventRoutes = events.map((e) => ({
    url: `${siteUrl}/events/${e.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...projectRoutes, ...eventRoutes];
}
