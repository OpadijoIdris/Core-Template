import prisma from "../config/postgres.js";

export const addToCartServices = async ({ userId, productId, quantity }) => {
    if(quantity <= 0) {
        throw new Error ("Quantity must be greater than zero")
    };

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });
    if(!product || !product.isActive || product.status !== "ACTIVE" ) {
        throw new Error ("Product is not available");
    }
    if(product.quantity < quantity) {
        throw new Error ("items requested for is more than available stock");
    };

    let cart = await prisma.cart.findUnique({
        where: { userId },
    })
    if(!cart) {
        cart = await prisma.cart.create({
            data: { userId }
        })
    }

    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId
            }
        }
    });
    
    if(existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if(newQuantity > product.quantity) {
            throw new Error ("Total quantity in cart exceeds available stock");
        }
        return prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity }
        })
    };

    return prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity
        }
    })
}

export const updateCartItemServices = async ({ userId, cartItemId, quantity }) => {
    if(quantity <= 0) {
        throw new Error ("Quantity must be greater than zero")
    };

    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true, product: true }
    });

    if(!cartItem) {
        throw new Error ("Cart item not found");
    }
    if(cartItem.cart.userId !== userId) {
        throw new Error ("Unauthorized access to cart item");
    }
    if(quantity > cartItem.product.quantity) {
        throw new Error ("Requested quantity exceeds available stock");
    };

    return prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
    })
};

export const removeCartItemServices = async ({ userId, cartItemId }) => {
    const cartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
        include: { cart: true }
    })
    if(!cartItem) {
        throw new Error ("Cart item not found");
    }

    if(cartItem.cart.userId !== userId) {
        throw new Error ("Unauthorized access to cart item");
    };

    return prisma.cartItem.delete({
        where: { id: cartItemId }
    })
};

export const getUserCartServices = async (userId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
    if(!cart) {
        return { items: [] };
    }

    return cart;
};

export const clearCartServices = async (userId) => {
    const cart = await prisma.cart.findUnique({
        where: { userId }
    });
    if(!cart) {
        return { cleared: 0 };
    }
    
    const result = await prisma.cartItem.deleteMany({
        where: { cartId: cart.id }
    });
    return { cleared: result.count };
};
