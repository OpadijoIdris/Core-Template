import prisma from "../config/postgres.js";
import { generateSlug } from "../utilis/slugify.js";

export const createCategoryService = async ({ name }) => {
    const baseSlug = generateSlug(name);

    let slug = baseSlug;
    let count = 1;

    while (
        await prisma.category.findUnique({ where: { slug } })
    ) {
        slug = `${ baseSlug }-${ count }`;
        count++;
    }

    return prisma.category.create({
        data: {
            name, 
            slug,
        }
    });
};

export const getCategoriesService = async () => {
    const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });

    return categories;
};

export const getCategoryByIdService = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if(!category){
        throw new Error ("Category not found")
    };
    return category;
};

export const updateCategoryService = async (id, data) => {
    if(data.name) {
        const baseSlug = generateSlug(data.name);
        let slug = baseSlug;
        let count = 1;

        while (
            await prisma.category.findFirst({
                where: {
                    slug,
                    NOT: { id }
                }
            })
        ) {
            slug = `${ baseSlug }-${ count }`;
            count++;
        }

        data.slug = slug;
    }
    return prisma.category.update({
        where: { id },
        data
    });
};

export const deleteCategoryService = async (id) => {
    const deleted = await prisma.category.update({
        where: { id },
        data: { isActive: false }
    });

    return deleted;
}
