import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: false,
      },
    },
  ],
});

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;
