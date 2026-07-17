const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const author = require("../../handlers/wcemb/author");
const title = require("../../handlers/wcemb/title");
const description = require("../../handlers/wcemb/description");
const color = require("../../handlers/wcemb/color");
const footer = require("../../handlers/wcemb/footer");
const img = require("../../handlers/wcemb/img");
const button = require("../../handlers/wcemb/button");
const field = require("../../handlers/wcemb/field");
const timestamp = require("../../handlers/wcemb/timestamp");
const preview = require("../../handlers/wcemb/preview");
const reset = require("../../handlers/wcemb/reset");
const variables = require("../../handlers/wcemb/variables");
const content = require("../../handlers/wcemb/content");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("wcemb")
        .setDescription("Configure the welcome embed.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addSubcommand(sub =>
            sub
                .setName("author")
                .setDescription("Set the embed author.")
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("Author text.")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("title")
                .setDescription("Set or remove the embed title.")
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("Embed title text.")
                        .setRequired(false)
                )

                .addBooleanOption(option =>
                    option
                        .setName("remove")
                        .setDescription("Remove the current title.")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("description")
                .setDescription("Set the embed description.")
        )

        .addSubcommand(sub =>
            sub
                .setName("color")
                .setDescription("Set the embed color.")
                .addStringOption(option =>
                    option
                        .setName("color")
                        .setDescription("Hex color (#5865F2)")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("footer")
                .setDescription("Set the embed footer.")
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("Footer text.")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("img")
                .setDescription("Configure embed images.")

                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription("Image type")
                        .setRequired(true)
                        .addChoices(
                            { name: "Author Icon", value: "author" },
                            { name: "Thumbnail", value: "thumbnail" },
                            { name: "Image", value: "image" },
                            { name: "Footer Icon", value: "footer" }
                        )
                )

                .addStringOption(option =>
                    option
                        .setName("variable")
                        .setDescription("Variable for the image URL")
                        .setRequired(false)
                
                )
                
                .addAttachmentOption(option =>
                    option
                        .setName("image")
                        .setDescription("Upload an image")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("button")
                .setDescription("Manage welcome buttons.")

                .addStringOption(option =>
                    option
                        .setName("action")
                        .setDescription("Action")
                        .setRequired(true)
                        .addChoices(
                            { name: "Add", value: "add" },
                            { name: "Remove", value: "remove" },
                            { name: "List", value: "list" },
                            { name: "Clear", value: "clear" }
                        )
                )

                .addStringOption(option =>
                    option
                        .setName("label")
                        .setDescription("Button label")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("emoji")
                        .setDescription("Button emoji")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("url")
                        .setDescription("Button URL")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("field")
                .setDescription("Manage embed fields.")

                .addStringOption(option =>
                    option
                        .setName("action")
                        .setDescription("Action")
                        .setRequired(true)
                        .addChoices(
                            { name: "Add", value: "add" },
                            { name: "Edit", value: "edit" },
                            { name: "Remove", value: "remove" },
                            { name: "List", value: "list" },
                            { name: "Clear", value: "clear" }
                        )
                )

                .addIntegerOption(option =>
                    option
                        .setName("id")
                        .setDescription("Field ID")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("name")
                        .setDescription("Field name")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName("value")
                        .setDescription("Field value")
                        .setRequired(false)
                )

                .addBooleanOption(option =>
                    option
                        .setName("inline")
                        .setDescription("Inline field?")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub => 
            sub
                .setName("variables")
                .setDescription("View all available welcome embed variables.")
        )

        .addSubcommand(sub => 
            sub
                .setName("content")
                .setDescription("Set or remove the welcome message content.")
                .addStringOption(option =>
                    option
                        .setName("text")
                        .setDescription("Message content before the embed.")
                        .setRequired(false)
                )

                .addBooleanOption(option =>
                    option
                        .setName("remove")
                        .setDescription("Remove the welcome message content.")
                        .setRequired(false)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("timestamp")
                .setDescription("Enable or disable timestamp.")
                .addBooleanOption(option =>
                    option
                        .setName("enabled")
                        .setDescription("Enable timestamp?")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("preview")
                .setDescription("Preview the welcome embed.")
        )

        .addSubcommand(sub =>
            sub
                .setName("reset")
                .setDescription("Reset the welcome embed.")
        ),    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {

            case "author":
                return author.execute(interaction);

            case "title":
                return title.execute(interaction);

            case "content":
                return content.execute(interaction);

            case "description":
                return description.execute(interaction);

            case "color":
                return color.execute(interaction);

            case "footer":
                return footer.execute(interaction);

            case "img":
                return img.execute(interaction);

            case "button":
                return button.execute(interaction);

            case "field":
                return field.execute(interaction);

            case "timestamp":
                return timestamp.execute(interaction);

            case "preview":
                return preview.execute(interaction);

            case "reset":
                return reset.execute(interaction);

            case "variables":
                return variables.execute(interaction);

            default:
                return interaction.reply({
                    content: "❌ Unknown subcommand.",
                    ephemeral: true
                });

        }

    }

};
