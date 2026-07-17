const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

const { logModeration } = require("../../utils/modLogger");

module.exports = {

    async execute(interaction) {

        const text = interaction.options.getString("text");
        const icon = interaction.options.getString("icon");
        const remove = interaction.options.getBoolean("remove");

        if (remove) {

            embedManager.updateNested(
                "welcome",
                "author",
                "text",
                null
            );


            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle("Author Message Removed")
                .setDescription(
                    "The welcome embed author text has been removed."
                )
                .setFooter({
                    text: "Welcome Embed Builder Update | Author Message",
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();



            const removeEmbed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("Welcome Embed Author Removed")
                .setDescription(
                    `**Moderator:** <@${interaction.user.id}>\n\n` +
                    `**Action:** *Removed welcome embed author message.*`
                )
                .setFooter({
                    text: "Welcome Embed Builder Update | Author Message",
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            await logModeration(
                interaction.guild,
                removeEmbed
            );


            return interaction.reply({
                embeds:[embed],
                ephemeral:true
            });

        }

        if (!text) {

            return interaction.reply({
                content:"❌ Please provide author text or use remove:true.",
                ephemeral:true
            });

        }

        embedManager.updateNested(
            "welcome",
            "author",
            "text",
            text
        );


        if (icon) {

            embedManager.updateNested(
                "welcome",
                "author",
                "icon",
                icon
            );

        }



        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("Author Message Updated")
            .setDescription(
                `The welcome embed author has been updated successfully.\n\n` +
                `**New Author:**\n${text}`
            )
            .setFooter({
                text: "Welcome Embed Builder Update | Author Message",
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();



        const logEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Welcome Embed Author Updated")
            .setDescription(
                `**Moderator:** <@${interaction.user.id}>\n\n` +
                `**Action:** *Updated welcome embed author message.*\n` +
                `**New Author:** \`${text}\``
            )
            .setFooter({
                text: "Welcome Embed Builder Update | Author Message",
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp();



        await logModeration(
            interaction.guild,
            logEmbed
        );


        await interaction.reply({
            embeds:[embed],
            ephemeral:true
        });

    }

};
