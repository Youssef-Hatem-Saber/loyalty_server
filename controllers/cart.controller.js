const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        let item = await Cart.findOne({ userId, productId });

        if (item) {
            item.quantity += quantity;
            await item.save();
            return res.status(200).json({ message: "Cart updated", item });
        }

        const newItem = await Cart.create({
            userId,
            productId,
            quantity
        });

        res.status(201).json({ message: "Added to cart", item: newItem });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await Cart.find({ userId }).populate("productId");

        if (cartItems.length === 0) {
            return res.status(200).json({
                items: [],
                cartTotal: 0
            });
        }

        let cartTotal = 0;

        const formattedCart = cartItems.map(item => {
            const price = item.productId.price;
            const quantity = item.quantity;
            const total = price * quantity;

            cartTotal += total;

            return {
                id: item._id,
                productId: item.productId._id,
                name: item.productId.name,
                price: price,
                quantity: quantity,
                total: total,
                image: item.productId.image
            };
        });

        res.status(200).json({
            items: formattedCart,
            cartTotal: cartTotal
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const item = await Cart.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Cart.findByIdAndDelete(id);

        if (!item)
            return res.status(404).json({ message: "Item not found" });

        res.status(200).json({ message: "Item removed" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await Cart.deleteMany({ userId });

        res.status(200).json({ message: "Cart cleared" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeItem,
    clearCart
};
