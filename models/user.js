const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, default: "" },
    phone: {
      type: String,
      match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      unique: true,
      sparse: true,
    },
    avatar: { type: String, default: "default-avatar-url.jpg" },

    telegramId: { type: Number, unique: true },

    balance: { type: Number, default: 0, min: 0 },
    gameHistory: [
      {
        date: { type: Date, default: Date.now },
        betAmount: { type: Number, required: true, min: 0 },
        coefficient: { type: Number, required: true, min: 1 },
        result: { type: String, enum: ["win", "lose"], required: true },
      },
    ],

    inventory: [
      {
        itemId: { type: Schema.Types.ObjectId, ref: "Item" },
        count: { type: Number, default: 1 },
      },
    ],

    language: { type: String, default: "ru", enum: ["ru", "en"] },
    lastActive: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// create() - додати користовача
// updateOne() - оновити користовача

const User = mongoose.model("User", userSchema);
module.exports = User;
