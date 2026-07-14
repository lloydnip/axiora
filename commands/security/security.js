const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("security")
        .setDescription("View the server's security configuration.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const db = loadJSON("security.json");

        const guildData = db[interaction.guild.id] || {};

        const lockdown = guildData.lockdown || {};

        const ignored =
            lockdown.ignoredChannels || [];

        const role =
            lockdown.role
                ? `<@&${lockdown.role}>`
                : "`Not Configured`";

        const moderator =
            lockdown.moderator
                ? `<@${lockdown.moderator}>`
                : "`None`";

        const started =
            lockdown.timestamp
                ? `<t:${Math.floor(lockdown.timestamp / 1000)}:F>\n<t:${Math.floor(lockdown.timestamp / 1000)}:R>`
                : "`Never`";

        const embed = new EmbedBuilder()
            .setColor(
                lockdown.active
                    ? "Red"
                    : "Green"
            )
            .setAuthor({
                name: `${interaction.guild.name} Security Dashboard`,
                iconURL: interaction.guild.iconURL()
            })
            .setThumbnail(interaction.guild.iconURL())

            .addFields(

                {
                    name: "🔒 Lockdown",
                    value: lockdown.active
                        ? "🟢 Active"
                        : "⚪ Inactive",
                    inline: true
                },

                {
                    name: "👮 Bypass Role",
                    value: role,
                    inline: true
                },

                {
                    name: "🚫 Ignored Channels",
                    value: `${ignored.length}`,
                    inline: true
                },

                {
                    name: "📝 Reason",
                    value: lockdown.reason || "`None`",
                    inline: false
                },

                {
                    name: "👤 Moderator",
                    value: moderator,
                    inline: true
                },

                {
                    name: "📅 Started",
                    value: started,
                    inline: true
                },

                {
                    name: "🛡️ Anti-Nuke",
                    value: "`Coming Soon`",
                    inline: true
                },

                {
                    name: "🤖 Anti-Bot",
                    value: "`Coming Soon`",
                    inline: true
                },

                {
                    name: "📨 Anti-Spam",
                    value: "`Coming Soon`",
                    inline: true
                },

                {
                    name: "🔗 Anti-Link",
                    value: "`Coming Soon`",
                    inline: true
                }

            )

            .setFooter({
                text: `Axiora Security • ${interaction.guild.name}`
            })

            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};