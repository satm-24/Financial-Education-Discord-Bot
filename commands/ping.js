const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    async execute(interaction) {
        console.log(interaction);
        console.log(interaction.user.username);
        await interaction.reply("pong");
    }
};