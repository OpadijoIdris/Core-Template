import prisma from "../config/postgres.js";
import { generateSlug } from "../utilis/slugify.js";

export const createSubcategoryService = async ({ name, categoryId }) => {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let count = 1;

    while (
        await prisma.subCategory.findUnique({ where: { slug } })
    ) {
        slug = `${ baseSlug }-${ count }`;
        count++;
    }

    return prisma.subCategory.create({
        data: {
            name,
            slug,
            categoryId
        }
    });
};

export const getSubcategoriesService = async () => {
    const subCategory = await prisma.subCategory.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });

    return subCategory;
};

export const getSubcategoryByIdService = async (id) => {
    const subcategory = await prisma.subCategory.findUnique({
        where: { id }
    });



    if(!subcategory) {
        throw new Error ("Subcategory not found")
    }

    return subcategory;
};

export const updateSubcategoryService = async (id, data, categoryId) => {
  if (data.name) {
    const baseSlug = generateSlug(data.name);
    const existingSlugs = await prisma.subCategory.findMany({
      where: {
        slug: { startsWith: baseSlug },
        NOT: { id: id }
      },
      select: { slug: true }
    });

    let slug = baseSlug;
    let count = 1;
    const slugSet = new Set(existingSlugs.map(s => s.slug));

    while (slugSet.has(slug)) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    data.slug = slug;
  }

  return prisma.subCategory.update({
    where: { id },
    data: {
      ...data,
      categoryId
    }
  });
};

export const deleteSubcategoryService = async (id) => {
    const deleted = await prisma.subCategory.update({
        where: { id }, 
        data: { isActive: false }
    })

    return deleted;
}
