import { addToCartServices, updateCartItemServices, removeCartItemServices, getUserCartServices, clearCartServices } from "../services/cart.service.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        const cartItem = await addToCartServices({ userId, productId, quantity });
        
        if(!cartItem){
            return res.status(400).json({
                success: false,
                message: "Failed to add item to cart"
            });
        }

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            data: cartItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: error.message
        })
    }
};


export const updateCart = async (req, res) => {
    try {
        const cartItem = await updateCartItemServices({ userId: req.user.id, ...req.body });
        if(!cartItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to update cart item"
            })
        }

        res.status(200).json({
            success: true,
            data: cartItem
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const cartItem = await removeCartItemServices({ userId: req.user.id, ...req.body });
        if(!cartItem) {
            return res.status(400).json({
                success: false,
                message: "Failed to remove cart item"
            })
        }

        res.status(200).json({
            success: true,
            data: cartItem
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getUserCart = async (req, res) => {
    try {
        const cart = await getUserCartServices(req.user.id);
        if(!cart) {
            return res.status(400).json({
                success: false,
                message: "Failed to get user cart"
            })
        }
        res.status(200).json({
            success: true,
            message: "Cart gotten successfully",
            data: cart
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const clearCart = async (req, res) => {
    try {
        const result = await clearCartServices(req.user.id);
        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


