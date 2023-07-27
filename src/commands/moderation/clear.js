const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'delete messages from channel',
    // devOnly: Boolean,
    testOnly: false,
    options: [
        {
            name: 'count',
            description: 'number of messages to delete (1-100)',
            required: true,
            type: ApplicationCommandOptionType.Integer,
        }
    ],
    // deleted: Boolean,
    permissionsRequired: [PermissionFlagsBits.ADMINISTRATOR],
    callback: async (client, interaction) => {
        const count = interaction.options.getInteger('count');

        if (count < 1 || count > 100) {
            return await interaction.reply('max messages to delete is 100 and minimum is 1, try again.');
        }

        try {
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: count + 1 });

            // Delete messages in batches
            fetchedMessages.forEach(async (message) => {
                await message.delete().catch(console.error);
            });

            const replyMessage = await interaction.reply(`deleted ${fetchedMessages.size} messages.`);

            setTimeout(() => {
                replyMessage.delete().catch(console.error);
            }, 5000); // 5000 milisekund (5 sekund)
        } catch (error) {
            console.error(error);
            await interaction.reply('something went wrong');
        }
    },
};
