import mongoose, { Document, Schema } from "mongoose";

interface IPastry extends Document {
  name: string;
  image: string;
  stock: number;
  quantityWon: number;
}

const PastrySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true },
    quantityWon: { type: Number, default: 0 },
  },
  { collection: "Pastry" }
);

const Pastry = mongoose.model<IPastry>("Pastry", PastrySchema);
export default Pastry;
