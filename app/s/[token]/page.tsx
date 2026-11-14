import type { Metadata } from "next";
import { SharedGallery } from "@/components/photos/shared-gallery";
import { photos } from "@/lib/mock/photos";
import { findShareLink, shareLinks } from "@/lib/mock/shares";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export function generateStaticParams() {
  return shareLinks.map((s) => ({ token: s.token }));
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { token } = await params;
  const link = findShareLink(token);
  return { title: link ? link.itemName : "Shared gallery" };
}

/** Public share page: no sidebar, no top bar – just the gallery and Akash Space branding. */
export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const link = findShareLink(token) ?? null;
  const items = link ? photos.filter((p) => link.photoIds.includes(p.id)) : [];
  return <SharedGallery link={link} photos={items} />;
}
