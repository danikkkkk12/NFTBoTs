const { Markup } = require('telegraf');
const fs = require('fs');

const appUrl = "https://danikkkkk12.github.io/nftbot/";
const agreementUrl = "https://example.com/user-agreement";
const videoPath = "./content/intro.mp4"; 

module.exports.startCommand = (ctx) => {
    ctx.replyWithVideo({ source: fs.createReadStream(videoPath) })
        .then(() => {
            ctx.reply("⬇ Выбери действие ниже:", Markup.inlineKeyboard([
                [Markup.button.webApp("🚀 Открыть приложение", appUrl)],
                [Markup.button.webApp("📜 User Agreement", agreementUrl)], 
                [Markup.button.callback("🌐 Join Community", "community")],
                [Markup.button.callback("❓ Support", "support")]
            ]));
        });
};

module.exports.buttonActions = (bot) => {
    bot.action("community", (ctx) => {
        ctx.reply("Присоединяйтесь к нашему сообществу: @your_community_link");
    });

    bot.action("support", (ctx) => {
        ctx.reply("Свяжитесь с поддержкой: @support_bot");
    });
};
