const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("balance").setDescription("Shows the user their balance"),
    async execute(interaction, profileData) {
        const { balance } = profileData;
        const username = interaction.user.username;

        await interaction.reply(`${username}, you have ${balance} points`)
    }
};