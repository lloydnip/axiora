const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Shows information about this server.'),

    async execute(interaction) {
        const { client } = interaction;
        const guild = interaction.guild;

        const owner = await guild.fetchOwner();

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .addFields(
                {
                    name: '👑 Owner',
                    value: `${owner.user.tag}`,
                    inline: true
                },
                {
                    name: '🆔 Server ID',
                    value: `\`${guild.id}\``,
                    inline: true
                },
                {
                    name: '👥 Members',
                    value: `\`${guild.memberCount.toLocaleString()}\``,
                    inline: true
                },
                {
                    name: '💬 Channels',
                    value: `\`${guild.channels.cache.size}\``,
                    inline: true
                },
                {
                    name: '🎭 Roles',
                    value: `\`${guild.roles.cache.size}\``,
                    inline: true
                },
                {
                    name: '😀 Emojis',
                    value: `\`${guild.emojis.cache.size}\``,
                    inline: true
                },
                {
                    name: '📅 Created',
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
                    inline: false
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag} | Server Statistics`,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};
