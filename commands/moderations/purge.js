const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Advanced message purge command.")

        // ALL
        .addSubcommand(sub =>
            sub
                .setName("all")
                .setDescription("Delete messages.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("1-100")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // USER
        .addSubcommand(sub =>
            sub
                .setName("user")
                .setDescription("Delete a user's messages.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Member")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // BOTS
        .addSubcommand(sub =>
            sub
                .setName("bots")
                .setDescription("Delete bot messages.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // HUMANS
        .addSubcommand(sub =>
            sub
                .setName("humans")
                .setDescription("Delete human messages.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // LINKS
        .addSubcommand(sub =>
            sub
                .setName("links")
                .setDescription("Delete messages containing links.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // EMBEDS
        .addSubcommand(sub =>
            sub
                .setName("embeds")
                .setDescription("Delete embed messages.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        // ATTACHMENTS
        .addSubcommand(sub =>
            sub
                .setName("attachments")
                .setDescription("Delete attachment messages.")
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Messages to scan")
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(100)
                )
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        const sub = interaction.options.getSubcommand();
        const amount = interaction.options.getInteger("amount");

        const messages = await interaction.channel.messages.fetch({
            limit: amount
        });

        let filtered = messages;

        switch (sub) {

            case "all":
                break;

            case "user":
                const user = interaction.options.getUser("user");
                filtered = messages.filter(m => m.author.id === user.id);
                break;

            case "bots":
                filtered = messages.filter(m => m.author.bot);
                break;

            case "humans":
                filtered = messages.filter(m => !m.author.bot);
                break;

            case "links":
                filtered = messages.filter(m =>
                    /(https?:\/\/|www\.)/i.test(m.content)
                );
                break;

            case "embeds":
                filtered = messages.filter(m =>
                    m.embeds.length > 0
                );
                break;

            case "attachments":
                filtered = messages.filter(m =>
                    m.attachments.size > 0
                );
                break;

        }

        const deleted = await interaction.channel.bulkDelete(filtered, true);

        const replyEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🧹 Purge Complete")
            .setDescription(`Deleted **${deleted.size}** message(s).`)
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("🧹 Messages Purged")
            .addFields(
                {
                    name: "Channel",
                    value: `${interaction.channel}`
                },
                {
                    name: "Moderator",
                    value: `${interaction.user.tag} (${interaction.user.id})`
                },
                {
                    name: "Type",
                    value: sub
                },
                {
                    name: "Deleted",
                    value: `${deleted.size}`
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [replyEmbed],
            ephemeral: true
        });

        await logModeration(interaction.guild, logEmbed);

    }
};