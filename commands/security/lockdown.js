const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lockdown")
        .setDescription("Lock the entire server.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the lockdown")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {
        const reason =
            interaction.options.getString("reason") ||
            "No reason provided";

        const db = loadJSON("security.json");

        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
        }

        if (!db[interaction.guild.id].lockdown) {
            db[interaction.guild.id].lockdown = {};
        }

        if (db[interaction.guild.id].lockdown.active) {
            return interaction.reply({
                content: "❌ This server is already under lockdown.",
                ephemeral: true
            });
        }

        db[interaction.guild.id].lockdown.pending = {
            moderator: interaction.user.id,
            reason: reason,
            createdAt: Date.now()
        };

        saveJSON("security.json", db);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("lockdown_confirm")
                .setLabel("Lock Server")
                .setEmoji("🔒")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("lockdown_cancel")
                .setLabel("Cancel")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary)
        );

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Confirm Lockdown")
            .setDescription(
                "This action will lock all text-based channels in this server.\n\n" +
                "Are you sure you want to continue?"
            )
            .addFields({
                name: "Reason",
                value: reason
            });

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};
