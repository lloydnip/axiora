const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows a user avatar.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user whose avatar you want to view.')
                .setRequired(false)
        ),

    async execute(interaction) {
        const { client } = interaction;
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarURL = user.displayAvatarURL({
            extension: 'png',
            size: 4096
        });

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`${user.username}'s Avatar`)
            .setImage(avatarURL)
            .setDescription(
                `[🔗 View Avatar](${avatarURL})`
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag} | Avatar Command`,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};
