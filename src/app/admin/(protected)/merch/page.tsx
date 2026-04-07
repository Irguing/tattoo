import { prisma } from "@/lib/prisma";
import MerchAdminClient from "@/components/admin/MerchAdmin.client";

export const dynamic = "force-dynamic";

export type ProductDTO = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  imageFilename: string | null;
  category: string;
  stock: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export default async function AdminMerchPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      imageFilename: true,
      category: true,
      stock: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const dto: ProductDTO[] = products.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Merch</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gestión de productos de la tienda. El precio se guarda en centavos.
        </p>
      </div>

      <MerchAdminClient initialProducts={dto} />
    </div>
  );
}
