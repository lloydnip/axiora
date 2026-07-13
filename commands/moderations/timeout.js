const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to timeout")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Examples: 10m, 1h, 1d, 7d")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const duration = interaction.options.getString("duration");
        const reason =
            interaction.options.getString("reason") || "No reason provided";

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member)
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });

        if (member.id === interaction.user.id)
            return interaction.reply({
                content: "❌ You cannot timeout yourself.",
                ephemeral: true
            });

        if (member.id === interaction.guild.ownerId)
            return interaction.reply({
                content: "❌ You cannot timeout the server owner.",
                ephemeral: true
            });

        if (!member.moderatable)
            return interaction.reply({
                content: "❌ I cannot timeout this member.",
                ephemeral: true
            });

        if (
            interaction.member.roles.highest.position <=
            member.roles.highest.position
        )
            return interaction.reply({
                content: "❌ You cannot timeout someone with an equal or higher role.",
                ephemeral: true
            });

        const match = duration.match(/^(\d+)(s|m|h|d)$/);

        if (!match)
            return interaction.reply({
                content: "❌ Invalid duration. Example: 10m, 1h, 1d",
                ephemeral: true
            });

        const value = Number(match[1]);
        const unit = match[2];

        let ms;

        switch (unit) {
            case "s":
                ms = value * 1000;
                break;
            case "m":
                ms = value * 60000;
                break;
            case "h":
                ms = value * 3600000;
                break;
            case "d":
                ms = value * 86400000;
                break;
        }

        if (ms > 2419200000)
            return interaction.reply({
                content: "❌ Maximum timeout is **28 days**.",
                ephemeral: true
            });

        await member.timeout(ms, reason);

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⏳ Member Timed Out")
            .setDescription(`<@${interaction.user.id}> have timed out <@${user.id}> (${user.tag}) for **${duration}**. **Reason:** ${reason}`)
            .setFooter({ text: `Duration: ${duration}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Member Timed Out")
            .setDescription(`**Member:** <@${user.id}> (${user.tag})\n**Moderator:** <@${interaction.user.id}> \n **Reason:** ${reason}`)
            .setFooter({ text: `Duration: ${duration}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        await logModeration(interaction.guild, logEmbed);
    }
};