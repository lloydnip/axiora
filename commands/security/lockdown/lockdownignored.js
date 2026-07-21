const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lockdownignored")
        .setDescription("View all ignored lockdown channels.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const db = loadJSON("lockdown.json");

        if (!db[interaction.guild.id])
            db[interaction.guild.id] = {};

        if (!db[interaction.guild.id].lockdown)
            db[interaction.guild.id].lockdown = {};

        if (!db[interaction.guild.id].lockdown.ignoredChannels)
            db[interaction.guild.id].lockdown.ignoredChannels = [];

        let ignored = db[interaction.guild.id].lockdown.ignoredChannels;

        // Remove deleted channels automatically
        ignored = ignored.filter(id =>
            interaction.guild.channels.cache.has(id)
        );

        db[interaction.guild.id].lockdown.ignoredChannels = ignored;

        saveJSON("lockdown.json", db);

        const list = ignored.length
            ? ignored
                  .map(id => `<#${id}>`)
                  .join("\n")
            : "*No ignored channels configured.*";

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle("🛡️ Lockdown Ignored Channels")
            .setDescription(list)
            .addFields({
                name: "Total",
                value: `${ignored.length}`,
                inline: true
            })
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL()
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
