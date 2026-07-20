const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Shows information about a role.')
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('The role you want to view.')
                .setRequired(true)
        ),

    async execute(interaction) {
        const { client } = interaction;
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
            .setColor(role.color || '#5865F2')
            .setTitle('Role Information')
            .addFields(
                {
                    name: '🏷️ Role Name',
                    value: `${role}`,
                    inline: true
                },
                {
                    name: '🆔 Role ID',
                    value: `\`${role.id}\``,
                    inline: true
                },
                {
                    name: '👥 Members',
                    value: `\`${role.members.size}\``,
                    inline: true
                },
                {
                    name: '📊 Position',
                    value: `\`${role.position}\``,
                    inline: true
                },
                {
                    name: '🔐 Mentionable',
                    value: role.mentionable ? 'Yes' : 'No',
                    inline: true
                },
                {
                    name: '📌 Hoisted',
                    value: role.hoist ? 'Yes' : 'No',
                    inline: true
                },
                {
                    name: '📅 Created',
                    value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`,
                    inline: false
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag} | Role Statistics`,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.reply({
            embeds: [embed]
        });
    }
};
