const {
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    customId: "ticket_remove",

    async execute(interaction) {

        const options = [];

        const overwrites = interaction.channel.permissionOverwrites.cache;

        for (
            const overwrite
            of overwrites.values()
        ) {
            if (
                overwrite.id === interaction.guild.id
            ) {
                continue;
            }

            const member = await interaction.guild.members
                .fetch(overwrite.id)
                .catch(() => null);

            if (member) {
                if (overwrite.allow.has("ViewChannel")) {
                    options.push(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(member.user.username)
                            .setDescription("Member currently in this ticket")
                            .setValue(`member_${member.id}`)
                    );
                }
                continue;
            }

            const role = interaction.guild.roles.cache.get(overwrite.id);

            if (role) {
                if (overwrite.allow.has("ViewChannel")) {
                    options.push(
                        new StringSelectMenuOptionBuilder()
                            .setLabel(`Role: ${role.name}`)
                            .setDescription("Role currently in this ticket")
                            .setValue(`role_${role.id}`)
                    );
                }
            }
        }

        if (options.length === 0) {
                    const embed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`:x: | There are no additional members or roles here`)
        
                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });
        }
        
            const menu = new StringSelectMenuBuilder()
                .setCustomId("ticket_remove_select")
                .setPlaceholder("Select a member or role to remove...")
                .addOptions(options.slice(0, 25));
        
            const row = new ActionRowBuilder()
                .addComponents(menu);
        
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`Select a member or role to remove to this ticket.`)
        
            await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });
    }
};