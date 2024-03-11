const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const quizData = require('../quiz.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startquiz')
        .setDescription('Starts a quiz'),

    async execute(interaction, profileData) {
        await interaction.reply("Welcome to the quiz game! 👋 Choose the correct answer by clicking the button.");

        // Randomly select a question from the quiz data
        const questionIndex = Math.floor(Math.random() * quizData.length);
        const question = quizData[questionIndex];

        const row = new ActionRowBuilder();
        question.options.forEach((option, index) => {
            const button = new ButtonBuilder()
                .setCustomId(`option_${index}`)
                .setLabel(`${option}`)
                .setStyle(ButtonStyle.Primary);

            row.addComponents(button);
        });

        let attempts = 0;
        const maxAttempts = 3;

        const message = await interaction.followUp({
            content: question.question,
            components: [row]
        });

        const filter = response => response.user.id === interaction.user.id;

        const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000, max: maxAttempts });

        function disableButtons(row) {
            const disabledRow = new ActionRowBuilder();
            row.components.forEach(button => {
                disabledRow.addComponents(button.setDisabled(true));
            });
            return disabledRow;
        }


        collector.on('collect', async i => {
            try {
                await i.deferUpdate(); // Acknowledge the interaction

                const chosenIndex = parseInt(i.customId.replace('option_', ''));
                attempts++;
                if (chosenIndex === question.correctIndex) {
                    profileData.balance += 10;
                    await profileData.save();
                    await i.followUp({ content: 'Correct! You have earned 10 points.' });
                    collector.stop();
                    const disabledRow = disableButtons(row);
                    await message.edit({ components: [disabledRow] });
                } else if (attempts < maxAttempts) {
                    await i.followUp({ content: `Incorrect answer. You have ${maxAttempts - attempts} attempts left.` });
                } else {
                    await i.followUp({ content: `Incorrect. You've used all your attempts. The correct answer was ${question.options[question.correctIndex]}.` });
                    collector.stop();
                    const disabledRow = disableButtons(row);
                    await message.edit({ components: [disabledRow] });
                }

            } catch (error) {
                console.error('Error handling button click:', error);
                await i.followUp({ content: 'There was an error processing your answer, please try again.' });
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.followUp('You did not answer the question in time.');
            }
        });

    }
};
