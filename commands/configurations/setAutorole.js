const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const embedManager = require("../../utils/embedManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setautorole")
        .setDescription("Set the role automatically given to new members.")
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("The role to automatically give to new members.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const role = interaction.options.getRole("role");

        const botMember = interaction.guild.members.me;

        if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                content: "❌ I need the **Manage Roles** permission.",
                ephemeral: true
            });
        }

        if (role.managed) {
            return interaction.reply({
                content: "❌ You cannot use a managed/integration role.",
                ephemeral: true
            });
        }

        if (role.position >= botMember.roles.highest.position) {
            return interaction.reply({
                content:
                    "❌ I cannot assign this role because it is higher than or equal to my highest role.",
                ephemeral: true
            });
        }

        embedManager.update(
            "welcome",
            "autorole",
            role.id
        );

        await interaction.reply({
            content:
                `✅ Autorole has been set to ${role}.\n\n` +
                `New members will automatically receive this role.`,
            ephemeral: true
        });
    }
};
