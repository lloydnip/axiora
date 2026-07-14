const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcome")
        .setDescription("Set the welcome channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Welcome channel")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const channel =
            interaction.options.getChannel("channel");

        const db = loadJSON("config.json");

        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
        }

        db[interaction.guild.id].welcomeChannel =
            channel.id;

        saveJSON("config.json", db);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Welcome Channel Set")
                    .setDescription(
                        `Welcome channel set to ${channel}`
                    )
            ]
        });

    }
};