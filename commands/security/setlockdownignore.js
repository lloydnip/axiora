const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlockdownignore")
        .setDescription("Add a channel to the lockdown ignore list.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to ignore during lockdown")
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

        if (ignored.includes(channel.id)) {
            return interaction.reply({
                content: "❌ That channel is already ignored during lockdown.",
                ephemeral: true
            });
        }

        ignored.push(channel.id);

        saveJSON("security.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Lockdown Ignore Added")
            .setDescription(
                `${channel} will remain **unlocked** during server lockdowns.`
            )
            .addFields(
                {
                    name: "Channel",
                    value: channel.toString(),
                    inline: true
                },
                {
                    name: "Ignored Channels",
                    value: `${ignored.length}`,
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