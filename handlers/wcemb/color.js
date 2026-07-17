const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");
const { logModeration } = require("../../utils/modLogger");

module.exports = {
    async execute(interaction) {

        const color = interaction.options.getString("color");

        if (!/^#([0-9A-F]{6})$/i.test(color)) {

            return interaction.reply({
                content: "❌ Please provide a valid hex color (example: `#5865F2`).",
                ephemeral: true
            });
        }

        embedManager.update(
            "welcome",
            "color",
            color
        );

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Welcome Color Updated")
            .setDescription(
                `Color set to \`${color}\``
            )
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Welcome Embed Color Updated")
            .setDescription(
                `**Moderator:** <@${interaction.user.id}>\n\n` +
                `**Action:** *Updated the welcome embed color.*\n` +
                `**New Color:** \`${color}\``
            )
            .setFooter({
                text: "Welcome Embed Builder | Color",
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        await logModeration(
            interaction.guild,
            logEmbed
        );
    }
};
