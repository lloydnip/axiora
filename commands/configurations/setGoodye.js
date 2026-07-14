const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setgoodbye")
        .setDescription("Set the goodbye channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Goodbye channel")
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

        db[interaction.guild.id].goodbyeChannel =
            channel.id;

        saveJSON("config.json", db);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Goodbye Channel Set")
                    .setDescription(
                        `Goodbye channel set to ${channel}`
                    )
            ]
        });

    }
};