const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removelockdownignore")
        .setDescription("Remove a channel from the lockdown ignore list.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to remove")
                .addChannelTypes(
                    ChannelType.GuildText,
                    ChannelType.GuildAnnouncement,
                    ChannelType.GuildForum
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel("channel");

        const db = loadJSON("security.json");

        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
        }

        if (!db[interaction.guild.id].lockdown) {
            db[interaction.guild.id].lockdown = {};
        }

        if (!db[interaction.guild.id].lockdown.ignoredChannels) {
            db[interaction.guild.id].lockdown.ignoredChannels = [];
        }

        const ignored =
            db[interaction.guild.id].lockdown.ignoredChannels;

        if (!ignored.includes(channel.id)) {
            return interaction.reply({
                content: "❌ That channel is not in the ignore list.",
                ephemeral: true
            });
        }

        db[interaction.guild.id].lockdown.ignoredChannels =
            ignored.filter(id => id !== channel.id);

        saveJSON("security.json", db);

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🗑️ Lockdown Ignore Removed")
            .setDescription(
                `${channel} will now be locked during lockdowns.`
            )
            .addFields(
                {
                    name: "Channel",
                    value: channel.toString(),
                    inline: true
                },
                {
                    name: "Remaining Ignored Channels",
                    value: `${db[interaction.guild.id].lockdown.ignoredChannels.length}`,
                    inline: true
                },
                {
                    name: "Updated By",
                    value: interaction.user.tag
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};