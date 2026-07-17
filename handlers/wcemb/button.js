const {
    EmbedBuilder,
    ButtonStyle
} = require("discord.js");

const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const action = interaction.options.getString("action");

        const config = embedManager.load("welcome");

        // Create buttons array if missing
        if (!Array.isArray(config.buttons)) {
            config.buttons = [];
        }

        switch (action) {

            // ===========================
            // ADD BUTTON
            // ===========================

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

                // Max buttons (Discord allows 25)
                if (config.buttons.length >= 25) {
                    return interaction.reply({
                        content: "❌ You already have the maximum of **25 buttons**.",
                        ephemeral: true
                    });
                }

                // Duplicate labels
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

                // URL validation
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

                embedManager.save("welcome", config);

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Button Added")
                    .addFields(
                        {
                            name: "Label",
                            value: label,
                            inline: true
                        },
                        {
                            name: "Emoji",
                            value: emoji || "None",
                            inline: true
                        },
                        {
                            name: "URL",
                            value: url
                        }
                    )
                    .setFooter({
                        text: `${config.buttons.length}/25 Buttons`
                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            }

            // ===========================
            // LIST BUTTONS
            // ===========================

            case "list": {

                if (!config.buttons.length) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Yellow")
                                .setTitle("📋 Welcome Buttons")
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
                    .setTitle("📋 Welcome Buttons")
                    .setDescription(description)
                    .setFooter({
                        text: `${config.buttons.length}/25 Buttons`
                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });

            }

            // ===========================
// REMOVE BUTTON
// ===========================

case "remove": {

    const label = interaction.options.getString("label");

    if (!label) {
        return interaction.reply({
            content: "❌ Please provide the button label.",
            ephemeral: true
        });
    }

    const index = config.buttons.findIndex(
        button => button.label.toLowerCase() === label.toLowerCase()
    );

    if (index === -1) {
        return interaction.reply({
            content: "❌ Button not found.",
            ephemeral: true
        });
    }

    const removed = config.buttons.splice(index, 1)[0];

    embedManager.save("welcome", config);

    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("🗑️ Button Removed")
        .setDescription(
            `Successfully removed **${removed.label}**.`
        )
        .setFooter({
            text: `${config.buttons.length}/25 Buttons`
        })
        .setTimestamp();

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

}

// ===========================
// CLEAR BUTTONS
// ===========================

case "clear": {

    if (!config.buttons.length) {
        return interaction.reply({
            content: "❌ There are no buttons to clear.",
            ephemeral: true
        });
    }

    config.buttons = [];

    embedManager.save("welcome", config);

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🗑️ Buttons Cleared")
        .setDescription(
            "All welcome buttons have been removed."
        )
        .setTimestamp();

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    });

}

default:

    return interaction.reply({
        content: "Unknown action.",
        ephemeral: true
    });

        }

    }

};