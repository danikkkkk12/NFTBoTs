const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: undefined
    },
    firstName: { 
      type: String, 
      required: true,
      trim: true
    },
    lastName: { 
      type: String, 
      trim: true,
      default: undefined
    },
    phone: {
      type: String,
      match: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      unique: true,
      sparse: true,
      default: undefined
    },
    avatar: { 
      type: String, 
      default: "default-avatar-url.jpg" 
    },
    telegramId: { 
      type: Number, 
      unique: true,
      required: true,
      index: true
    },
    balance: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
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
    language: { 
      type: String, 
      default: "ru", 
      enum: ["ru", "en"] 
    },
    lastActive: { 
      type: Date, 
      default: Date.now 
    },
    isAdmin: { 
      type: Boolean, 
      default: false 
    },
  },
  { 
    timestamps: true,
    minimize: false,
    autoIndex: true
  }
);

userSchema.statics.syncIndexes = async function() {
  try {
    await this.syncIndexes();
    console.log('✅ Индексы пользователя синхронизированы');
  } catch (err) {
    console.error('❌ Ошибка синхронизации индексов:', err);
  }
};

const User = mongoose.model("User", userSchema);

User.createIndexes()
  .then(() => console.log('✅ Индексы модели User созданы'))
  .catch(err => console.error('❌ Ошибка создания индексов:', err));

module.exports = User;
