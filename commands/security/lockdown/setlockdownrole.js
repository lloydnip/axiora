const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setlockdownrole")
        .setDescription("Set the role that can bypass server lockdowns.")
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Role allowed to chat during lockdown")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const role = interaction.options.getRole("role");

        const db = loadJSON("security.json");

        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {};
        }

        if (!db[interaction.guild.id].lockdown) {
            db[interaction.guild.id].lockdown = {};
        }

        db[interaction.guild.id].lockdown.role = role.id;

        saveJSON("security.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔒 Lockdown Role Updated")
            .setDescription(
                `${role} will now bypass server lockdowns.`
            )
            .addFields(
                {
                    name: "Role",
                    value: role.toString(),
                    inline: true
                },
                {
                    name: "Role ID",
                    value: role.id,
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