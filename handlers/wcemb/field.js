const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const action = interaction.options.getString("action");

        const config = embedManager.load("welcome");

        if (!Array.isArray(config.fields))
            config.fields = [];

        switch (action) {

            // =============================
            // ADD FIELD
            // =============================

            case "add": {

                const name = interaction.options.getString("name");
                const value = interaction.options.getString("value");
                const inline = interaction.options.getBoolean("inline") ?? false;

                if (!name || !value) {
                    return interaction.reply({
                        content: "❌ Name and Value are required.",
                        ephemeral: true
                    });
                }

                if (config.fields.length >= 25) {
                    return interaction.reply({
                        content: "❌ Discord only allows **25 embed fields**.",
                        ephemeral: true
                    });
                }

                config.fields.push({
                    name,
                    value,
                    inline
                });

                embedManager.save("welcome", config);

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("✅ Field Added")
                            .addFields(
                                {
                                    name: "Title",
                                    value: name
                                },
                                {
                                    name: "Inline",
                                    value: inline ? "Yes" : "No",
                                    inline: true
                                }
                            )
                            .setDescription(value)
                            .setFooter({
                                text: `${config.fields.length}/25 Fields`
                            })
                    ],
                    ephemeral: true
                });

            }

            // =============================
            // LIST
            // =============================

            case "list": {

                if (!config.fields.length) {

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Yellow")
                                .setTitle("📋 Embed Fields")
                                .setDescription("No fields configured.")
                        ],
                        ephemeral: true
                    });

                }

                const text = config.fields
                    .map((field, index) => {

                        return `**${index + 1}. ${field.name}**
Inline: ${field.inline ? "Yes" : "No"}
${field.value}`;

                    })
                    .join("\n\n");

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle("📋 Embed Fields")
                            .setDescription(text)
                            .setFooter({
                                text: `${config.fields.length}/25 Fields`
                            })
                    ],
                    ephemeral: true
                });

            }

            // =============================
// EDIT FIELD
// =============================

case "edit": {

    const id = interaction.options.getInteger("id");
    const name = interaction.options.getString("name");
    const value = interaction.options.getString("value");
    const inline = interaction.options.getBoolean("inline");

    if (!id) {
        return interaction.reply({
            content: "❌ Please provide a field ID.",
            ephemeral: true
        });
    }

    if (id < 1 || id > config.fields.length) {
        return interaction.reply({
            content: "❌ Invalid field ID.",
            ephemeral: true
        });
    }

    const field = config.fields[id - 1];

    if (name) field.name = name;
    if (value) field.value = value;
    if (inline !== null) field.inline = inline;

    embedManager.save("welcome", config);

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Field Updated")
                .addFields(
                    {
                        name: "Field",
                        value: `#${id}`,
                        inline: true
                    },
                    {
                        name: "Inline",
                        value: field.inline ? "Yes" : "No",
                        inline: true
                    }
                )
                .setDescription(`**${field.name}**\n${field.value}`)
                .setTimestamp()
        ],
        ephemeral: true
    });

}

// =============================
// REMOVE FIELD
// =============================

case "remove": {

    const id = interaction.options.getInteger("id");

    if (!id) {
        return interaction.reply({
            content: "❌ Please provide a field ID.",
            ephemeral: true
        });
    }

    if (id < 1 || id > config.fields.length) {
        return interaction.reply({
            content: "❌ Invalid field ID.",
            ephemeral: true
        });
    }

    const removed = config.fields.splice(id - 1, 1)[0];

    embedManager.save("welcome", config);

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Orange")
                .setTitle("🗑️ Field Removed")
                .setDescription(`Removed **${removed.name}**`)
                .setFooter({
                    text: `${config.fields.length}/25 Fields`
                })
                .setTimestamp()
        ],
        ephemeral: true
    });

}

// =============================
// CLEAR FIELDS
// =============================

case "clear": {

    if (!config.fields.length) {
        return interaction.reply({
            content: "❌ There are no fields to clear.",
            ephemeral: true
        });
    }

    config.fields = [];

    embedManager.save("welcome", config);

    return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Red")
                .setTitle("🗑️ Fields Cleared")
                .setDescription("All embed fields have been removed.")
                .setTimestamp()
        ],
        ephemeral: true
    });

}

// =============================
// DEFAULT
// =============================

default: {

    return interaction.reply({
        content: "❌ Unknown action.",
        ephemeral: true
    });

}

        }

    }

};