import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  // aqui son los campos que tendra mi bd sin colocar id xq ya lo asigna, este es un ejemplo

  title: {
    type: String,
    required: [true, "El título es obligatorio"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
  },
  price: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"],
  },
  code: {
    type: String,
    required: [true, "El código es obligatorio"],
    unique: true,
  },
  stock: {
    type: Number,
    required: [true, "El stock es obligatorio"],
    min: [0, "El stock no puede ser negativo"],
  },
  category: {
    type: String,
    required: [true, "La categoría es obligatoria"],
  },
  status: {
    type: Boolean,
    required: true,
  },
  thumbnails: {
    type: [String],
  },
});

productSchema.plugin(mongoosePaginate);

const ProductsModel = mongoose.model("Products", productSchema);

export default ProductsModel;
