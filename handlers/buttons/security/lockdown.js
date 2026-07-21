const {
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const {
    loadJSON,
    saveJSON
} = require("../../../utils/database");

module.exports = {
    customId: "lockdown_confirm",

    async execute(interaction, client) {

        if (
            !interaction.member.permissions.has(
                PermissionFlagsBits.Administrator
            )
        ) {
            return interaction.reply({
                content:
                    "❌ You need Administrator permission.",
                ephemeral: true
            });
        }

        const db = loadJSON("security.json");

        const guildId =
            interaction.guild.id;

        const lockdown =
            db[guildId]?.lockdown;

        if (!lockdown?.pending) {

            return interaction.update({
                content:
                    "❌ This lockdown request has expired.",
                embeds: [],
                components: []
            });
        }

        const pending =
            lockdown.pending;

        await interaction.update({
            content:
                "🔒 Lockdown is being activated...",
            embeds: [],
            components: []
        });

        let lockedChannels = 0;

        const channels =
            interaction.guild.channels.cache.filter(
                channel =>
                    channel.isTextBased() &&
                    !channel.isThread()
            );

        for (
            const [, channel]
            of channels
        ) {

            try {

                await channel.permissionOverwrites.edit(
                    interaction.guild.roles.everyone,
                    {
                        SendMessages: false,
                        AddReactions: false
                    }
                );

                lockedChannels++;

            } catch (error) {

                console.error(
                    `Failed to lock ${channel.name}:`,
                    error.message
                );
            }
        }

        db[guildId].lockdown = {
            active: true,
            moderator: pending.moderator,
            reason: pending.reason,
            startedAt: Date.now(),
            lockedChannels
        };

        saveJSON(
            "security.json",
            db
        );

        const embed =
            new EmbedBuilder()
                .setColor("DarkRed")
                .setTitle(
                    "🔒 Server Lockdown Activated"
                )
                .setDescription(
                    "The server has been placed under lockdown."
                )
                .addFields(
                    {
                        name: "🔒 Locked Channels",
                        value:
                            `\`${lockedChannels}\``,
                        inline: true
                    },
                    {
                        name: "📝 Reason",
                        value:
                            pending.reason,
                        inline: true
                    }
                )
                .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed],
            components: []
        });
    }
};
