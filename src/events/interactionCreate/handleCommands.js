const { devIDs, testServerID } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandName = interaction.commandName;
    const commandObject = localCommands.find((cmd) => cmd.name === commandName);

    if (!commandObject) return;

    const { devOnly, testOnly, permissionsRequired, botPermissions, callback } = commandObject;
    const member = interaction.member;
    const botMember = interaction.guild.members.cache.get(client.user.id);

    if (devOnly && !devIDs.includes(member.user.id)) {
      return interaction.reply({
        content: 'Only developers are allowed to run this command.',
        ephemeral: true,
      });
    }

    if (testOnly && interaction.guildId !== testServerID) {
      return interaction.reply({
        content: 'This command cannot be run here.',
        ephemeral: true,
      });
    }

    if (permissionsRequired?.length) {
      const hasRequiredPermissions = permissionsRequired.every((permission) =>
        member.permissions.has(permission)
      );
      if (!hasRequiredPermissions) {
        return interaction.reply({
          content: 'Not enough permissions.',
          ephemeral: true,
        });
      }
    }

    if (botPermissions?.length) {
      const hasBotPermissions = botPermissions.every((permission) =>
        botMember.permissions.has(permission)
      );
      if (!hasBotPermissions) {
        return interaction.reply({
          content: "I don't have enough permissions.",
          ephemeral: true,
        });
      }
    }

    await callback(client, interaction);
  } catch (error) {
    console.error(`There was an error running this command: ${error}`);
  }
};
