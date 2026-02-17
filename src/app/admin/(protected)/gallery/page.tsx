import { prisma } from "@/lib/prisma";
import GalleryAdminClient from "@/components/admin/GalleryAdmin.client";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      alt: true,
      tags: true,
      url: true,
      filename: true,
      mime: true,
      size: true,
      isPublished: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gallery</h1>
        <p className="mt-1 text-sm text-gray-600">
          Upload a <code className="rounded bg-gray-100 px-1.5 py-0.5">/public/uploads</code> + metadata en DB.
        </p>
      </div>

      <GalleryAdminClient initialImages={images} />
    </div>
  );
}
