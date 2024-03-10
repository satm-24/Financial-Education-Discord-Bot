const { Events } = require('discord.js');
const profileModel = require('../models/profileSchema');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {

            let profileData;
            try {
                profileData = await profileModel.findOne({ userId: interaction.user.id });
                if (!profileData) {
                    let profile = await profileModel.create({
                        userId: interaction.user.id,
                        serverId: interaction.guild.id,
                    });
                    profileData = profile;
                }
            } catch (err) {
                console.error(err);
            }

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction, profileData);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isButton()) {
            // respond to the button
        } else if (interaction.isStringSelectMenu()) {

            let selectedVal = interaction.values[0]

            if (selectedVal == 'squirtle') {
                await interaction.reply("That answer is correct!")
            } else {
                await interaction.reply("That answer is incorrect, try again.")
            }
        }
        else {
            return;
        }
    },
};