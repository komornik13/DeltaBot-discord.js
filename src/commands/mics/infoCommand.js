// Importing required modules
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const getLocalCommands = require('../../utils/getLocalCommands');

// Exporting the 'help' command
module.exports = {
  name: 'help',
  description: 'Shows all commands available',

  // The callback function for the 'help' command
  callback: async (client, interaction) => {
    try {
      // Acknowledge the interaction and defer reply
      await interaction.deferReply();

      // Fetch the list of local commands using the getLocalCommands function
      const localCommands = getLocalCommands();

      // Create the embed message with the list of commands
      const embed = new EmbedBuilder()
        .setTitle(' ⭐ **Help** ⭐  ')
        .setDescription('commands : \n')
        .setDescription(localCommands.map((cmd) => `**/${cmd.name}**: ${cmd.description}`).join('\n'))
        .setColor(0x00FFFF);

      // Send the embed message to the same channel where the command was invoked
      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error('Error executing help command:', error);
    }
  },
};
