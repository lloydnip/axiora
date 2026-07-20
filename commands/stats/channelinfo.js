const {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription('Shows information about the current channel.'),

    async execute(interaction) {
        const { client } = interaction;
        const channel = interaction.channel;

        const channelTypes = {
            [ChannelType.GuildText]: 'Text Channel',
            [ChannelType.GuildVoice]: 'Voice Channel',
            [ChannelType.GuildCategory]: 'Category',
            [ChannelType.GuildAnnouncement]: 'Announcement Channel',
            [ChannelType.GuildForum]: 'Forum Channel',
            [ChannelType.GuildStageVoice]: 'Stage Channel'
        };

        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('Channel Information')
            .addFields(
                {
                    name: '🏷️ Channel Name',
                    value: `${channel}`,
                    inline: true
                },
                {
                    name: '🆔 Channel ID',
                    value: `\`${channel.id}\``,
                    inline: true
                },
                {
                    name: '📂 Type',
                    value: channelTypes[channel.type] || 'Unknown',
                    inline: true
                },
                {
                    name: '📅 Created',
                    value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`,
                    inline: false
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag} | Channel Statistics`,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};
