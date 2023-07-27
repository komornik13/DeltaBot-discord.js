const { ApplicationCommandOptionType, PermissionFlagsBits, MessageAttachment } = require('discord.js');
module.exports = {
    name: 'post',
    description: 'create embed post',
    // devOnly: Boolean,
    testOnly: false,
    options: [
        {
            name: 'title',
            description: 'title of the post',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'description',
            description: 'you can add here your own description',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'titlelink',
            description: 'after clicking the title the link will open',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'fieldname',
            description: 'name of the field',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'fieldlink',
            description: 'place for link it can be download or something',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'image',
            description: 'link of any photo/gif/video',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    // deleted: Boolean,
    permissionsRequired: [PermissionFlagsBits.ADMINISTRATOR],
    callback: async (client, interaction) => {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const titlelink = interaction.options.getString('titlelink');
        const fieldname = interaction.options.getString('fieldname');
        const fieldlink = interaction.options.getString('fieldlink');
        const image = interaction.options.getString('image');

        let link = ''; // Variable to store the link for the button or plain text

        // Check if fieldlink starts with a supported scheme
        if (fieldlink && (fieldlink.startsWith('http://') || fieldlink.startsWith('https://'))) {
            link = fieldlink; // Use fieldlink as the link for the button
        } else {
            // If fieldlink is not a supported link, treat it as plain text
            link = fieldlink || titlelink || 'https://u.com'; // Use 'fieldlink' if provided, otherwise use 'titlelink', or the default link 'https://example.com' if both are not provided.
        }

        const disabled = link === 'https://u.com'; // Check if the link is 'https://u.com' to set the button to disabled

        const components = [
            {
                type: 1,
                components: [
                    {
                        style: 5,
                        url: link,
                        disabled: disabled, // Set disabled to true if 'link' is 'https://u.com'.
                        emoji: {
                            id: null,
                            name: '🔍'
                        },
                        type: 2
                    }
                ]
            }
        ];

        const embed = {
            type: 'rich',
            title: title,
            description: description,
            color: 0xefefef,
            url: titlelink,
            fields: []
        };

        // Check if 'link' is not 'https://u.com' and if 'fieldname' is provided
        if (!disabled && fieldname) {
            // Add fields to the embed only if the button is not disabled and 'fieldname' is provided
            embed.fields.push({
                name: `${fieldname}`,
                value: `${link}` // Use the link or plain text here
            });
        } if (!fieldname && !disabled) {
            embed.fields.push({
                name: ` `,
                value: `${link}`
            });
        } if (fieldname && !fieldlink) {
            embed.fields.push({
                name: `${fieldname}`,
                value: ``
        })
    }
        const imageAttachment = image ? new MessageAttachment(image) : null;

        await interaction.channel.send({
            files: [imageAttachment].filter(Boolean), // Add the image attachment if provided
            content: '',
            tts: false,
            embeds: [embed],
            components: components,
        });
    },
};