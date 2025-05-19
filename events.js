const User = require("./models/user");

module.exports.userJoined = async (ctx) => {
  try {
    for (const newUser of ctx.message.new_chat_members) {
      const user = await User.findOneAndUpdate(
        { telegramId: newUser.id },
        {
          username: newUser.username || undefined,
          firstName: newUser.first_name || "NoName",
          lastName: newUser.last_name || undefined
        },
        { upsert: true, new: true }
      );
      console.log(`👋 Пользователь ${user.telegramId} присоединился к чату`);
    }
  } catch (err) {
    console.error("❌ Ошибка при обработке нового участника:", err);
  }
};