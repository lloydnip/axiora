const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlockdown")
        .setDescription("Restore the server after a lockdown.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const db = loadJSON("security.json");

        if (
            !db[interaction.guild.id] ||
            !db[interaction.guild.id].lockdown?.active
        ) {
            return interaction.reply({
                content: "❌ This server is not currently under lockdown.",
                ephemeral: true
            });
        }

        await interaction.deferReply();

        const backup = db[interaction.guild.id].lockdown.channels || {};

        let restored = 0;

        for (const [channelId, data] of Object.entries(backup)) {

            const channel =
                interaction.guild.channels.cache.get(channelId);

            if (!channel) continue;

            try {

                await channel.permissionOverwrites.edit(
                    interaction.guild.roles.everyone,
                    {
                        SendMessages: data.sendMessages
                    }
                );

                restored++;

            } catch (err) {
                console.error(err);
            }

        }

        db[interaction.guild.id].lockdown = {
            role: db[interaction.guild.id].lockdown.role
        };

        saveJSON("security.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 Lockdown Lifted")
            .setDescription("The server has been restored.")
            .addFields(
                {
                    name: "Channels Restored",
                    value: `${restored}`,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.editReply({
            embeds: [embed]
        });

    }
};