const {
    EmbedBuilder
} = require("discord.js");

const embedManager = require("../../utils/embedManager");
const { logModeration } = require("../../utils/modLogger");

module.exports = {

    async execute(interaction) {

        const action = interaction.options.getString("action");

        const config = embedManager.load("welcome");

        if (!Array.isArray(config.buttons)) {
            config.buttons = [];
        }

        switch (action) {
            case "add": {
                const label = interaction.options.getString("label");
                const emoji = interaction.options.getString("emoji");
                const url = interaction.options.getString("url");

                if (!label || !url) {
                    return interaction.reply({
                        content: "❌ Label and URL are required.",
                        ephemeral: true
                    });
                }

                if (config.buttons.length >= 25) {

                    return interaction.reply({
                        content: "❌ You already have the maximum of 25 buttons.",
                        ephemeral: true
                    });
                }

                if (
                    config.buttons.some(
                        b => b.label.toLowerCase() === label.toLowerCase()
                    )
                ) {
                    return interaction.reply({
                        content: "❌ A button with that label already exists.",
                        ephemeral: true
                    });

                }

                try {
                    new URL(url);
                } catch {
                    return interaction.reply({
                        content: "❌ Please provide a valid URL.",
                        ephemeral: true
                    });
                }

                config.buttons.push({
                    label,
                    emoji: emoji || null,
                    style: "LINK",
                    url
                });

                embedManager.save(
                    "welcome",
                    config
                );

                const logEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Welcome Embed Button Added")
                    .setDescription(
                        `**Moderator:** <@${interaction.user.id}>\n\n` +
                        `**Action:** *Added a welcome button.*\n` +
                        `**Label:** ${label}\n` +
                        `**Emoji:** ${emoji || "None"}\n` +
                        `**URL:** ${url}`
                    )
                    .setFooter({
                        text: "Welcome Embed Builder | Buttons",
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await logModeration(
                    interaction.guild,
                    logEmbed
                );

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Welcome Embed Button Added")
                    .setDescription(
                        `Successfully added a new button to the welcome embed.\n\n` +
                        `**Label:** ${label}\n` +
                        `**Emoji:** ${emoji || "None"}\n` +
                        `**URL:** ${url}`
                    )
                    .setFooter({
                        text: `Welcome Embed Builder | Buttons (${config.buttons.length}/25)`,
                        iconURL: interaction.client.user.displayAvatarURL()

                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }

            case "list": {
                if (!config.buttons.length) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Yellow")
                                .setTitle("⚠️ No Buttons Configured")
                                .setDescription(
                                    "No buttons have been configured."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const description = config.buttons
                    .map((button, index) => {
                        return [
                            `**${index + 1}. ${button.label}**`,
                            `Emoji: ${button.emoji || "None"}`,
                            `URL: ${button.url}`
                        ].join("\n");
                    })
                    .join("\n\n");

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Welcome Embed Button List")
                    .setDescription(description)
                    .setFooter({
                        text: `${config.buttons.length}/25 Buttons`,
                        iconURL: interaction.client.user.displayAvatarURL()

                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds:[embed],
                    ephemeral:true
                });
            }

            case "remove": {
                const label = interaction.options.getString("label");

                if (!label) {
                    return interaction.reply({
                        content:"❌ Please provide the button label.",
                        ephemeral:true
                    });
                }

                const index = config.buttons.findIndex(
                    button =>
                        button.label.toLowerCase() === label.toLowerCase()
                );

                if (index === -1) {
                    return interaction.reply({
                        content:"❌ Button not found.",
                        ephemeral:true
                    });
                }

                const removed = config.buttons.splice(index,1)[0];

                embedManager.save(
                    "welcome",
                    config
                );

                const logEmbed = new EmbedBuilder()

                    .setColor("Random")
                    .setTitle("Welcome Embed Button Removed")
                    .setDescription(
                        `**Moderator:** <@${interaction.user.id}>\n\n` +
                        `**Action:** *Removed a welcome button.*\n\n` +
                        `**Button:** ${removed.label}`
                    )
                    .setFooter({
                        text:"Welcome Embed Builder | Buttons",
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await logModeration(
                    interaction.guild,
                    logEmbed
                );

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Welcome Embed Button Removed")
                    .setDescription(
                        `Successfully removed **${removed.label}**.`
                    )
                    .setFooter({
                        text:`${config.buttons.length}/25 Buttons`,
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds:[embed],
                    ephemeral:true
                });
            }

            case "clear": {
                if (!config.buttons.length) {
                    return interaction.reply({
                        content:"❌ There are no buttons to clear.",
                        ephemeral:true
                    });
                }

                config.buttons = [];

                embedManager.save(
                    "welcome",
                    config
                );

                const logEmbed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Welcome Embed Buttons Cleared")
                    .setDescription(
                        `**Moderator:** <@${interaction.user.id}>\n\n` +
                        `**Action:** *Removed all welcome buttons.*`
                    )
                    .setFooter({
                        text:"Welcome Embed Builder | Buttons",
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await logModeration(

                    interaction.guild,

                    logEmbed

                );

                const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle("Welcome Embed Buttons Cleared")
                    .setDescription(
                        "All welcome buttons have been removed."
                    )
                    .setFooter({
                        text:"Welcome Embed Builder | Buttons",
                        iconURL: interaction.client.user.displayAvatarURL()
                    })
                    .setTimestamp();



                return interaction.reply({

                    embeds:[embed],

                    ephemeral:true

                });


            }

            default:

                return interaction.reply({

                    content:"❌ Unknown action.",

                    ephemeral:true

                });

        }

    }

};
