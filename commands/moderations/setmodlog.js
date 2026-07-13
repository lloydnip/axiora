const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmodlog")
        .setDescription("Set the moderation log channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Log channel")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const channel = interaction.options.getChannel("channel");

        const db = loadJSON("config.json");

        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
        }

        db[interaction.guild.id].modLogChannel = channel.id;

        saveJSON("config.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Moderation Log Updated")
            .setDescription(`Mod logs will now be sent to ${channel}.`)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};