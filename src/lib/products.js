export function normalizeImagePath(image) {
  if (!image) return "";

  // URL completa: no tocar
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  // Si guardaron "public/uploads/..."
  if (image.startsWith("public/")) image = image.replace(/^public\//, "");

  // Quitar "./" si viniera
  if (image.startsWith("./")) image = image.slice(2);

  // Asegurar barra inicial
  if (!image.startsWith("/")) image = `/${image}`;

  return image;
}

export async function getAllProducts() {
  const modules = import.meta.glob("../content/products/*.md", { eager: true });

  const items = Object.values(modules).map((m) => {
    const data = m.frontmatter ?? {};
    return {
      name: data.name ?? "",
      slug: data.slug ?? "",
      price: Number(data.price ?? 0),
      image: normalizeImagePath(data.image ?? ""),
      images: Array.isArray(data.images) ? data.images.map(normalizeImagePath) : [],
      description: data.description ?? "",
      order: Number(data.order ?? 0),
      active: data.active !== false,
    };
  });

  return items
    .filter((p) => p.active && p.slug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getProductBySlug(slug) {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}
