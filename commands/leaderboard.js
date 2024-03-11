const { SlashCommandBuilder } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the balance leaderboard'),

    async execute(interaction) {
        try {
            // Fetch top 10 users with the highest balance, sorted in descending order
            const leaderboardData = await profileModel.find({})
                .sort({ balance: -1 })
                .limit(10);

            let leaderboardMessage = "🏆 **Balance Leaderboard** 🏆\n\n";
            leaderboardData.forEach((profile, index) => {
                leaderboardMessage += `**${index + 1}.** <@${profile.userId}> - ${profile.balance} points\n`;
            });

            await interaction.reply(leaderboardMessage);
        } catch (err) {
            console.error(err);
            await interaction.reply('There was an error displaying the leaderboard.');
        }
    }
};
