const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You cannot warn yourself.",
                ephemeral: true
            });
        }

        if (user.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "❌ You cannot warn the server owner.",
                ephemeral: true
            });
        }

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ That member is not in this server.",
                ephemeral: true
            });
        }

        if (
            interaction.member.roles.highest.position <=
            member.roles.highest.position
        ) {
            return interaction.reply({
                content: "❌ You cannot warn someone with an equal or higher role.",
                ephemeral: true
            });
        }

        // Load database
        const db = loadJSON("warnings.json");

        // Create guild data if it doesn't exist
        if (!db[interaction.guild.id]) {
            db[interaction.guild.id] = {
                nextCaseId: 1,
                warnings: {}
            };
        }

        const guildData = db[interaction.guild.id];

        // Create user warnings if they don't exist
        if (!guildData.warnings[user.id]) {
            guildData.warnings[user.id] = [];
        }

        // Global case ID
        const caseId = guildData.nextCaseId++;

        guildData.warnings[user.id].push({
            caseId,
            reason,
            moderator: interaction.user.id,
            timestamp: Date.now()
        });

        saveJSON("warnings.json", db);

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⚠️ Member Warned")
            .addFields(
                {
                    name: "Member",
                    value: `${user.tag} (${user.id})`
                },
                {
                    name: "Case ID",
                    value: `#${caseId}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await logModeration(interaction.guild, embed);

    }
};