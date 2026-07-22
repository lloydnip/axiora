const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    customId: "ticket_add",

    async execute(interaction) {

        const members =
            interaction.guild.members.cache
                .filter(member =>
                    !member.user.bot
                )
                .first(20);

        const roles =
            interaction.guild.roles.cache
                .filter(role =>
                    role.id !==
                    interaction.guild.id
                )
                .sort(
                    (a, b) =>
                        b.position - a.position
                )
                .first(20);

        const options = [];

        // =========================
        // MEMBERS
        // =========================

        for (
            const member
            of members
        ) {

            options.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(
                        member.user.username
                    )
                    .setDescription(
                        `Member • ${member.id}`
                    )
                    .setValue(
                        `member_${member.id}`
                    )
            );
        }

        // =========================
        // ROLES
        // =========================

        for (
            const role
            of roles
        ) {

            options.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(
                        `Role: ${role.name}`
                    )
                    .setDescription(
                        `Role • ${role.id}`
                    )
                    .setValue(
                        `role_${role.id}`
                    )
            );
        }

        if (options.length === 0) {
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`:x: | There are no members or roles here`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId("ticket_add_select")
            .setPlaceholder("Select a member or role to add...")
            .addOptions(options.slice(0, 25));

        const row = new ActionRowBuilder()
            .addComponents(menu);

        const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(`Select a member or role to add to this ticket.`)

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};