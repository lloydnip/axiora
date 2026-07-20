const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('Shows all servers where the bot is currently installed.'),

    async execute(interaction) {
        const { client } = interaction;

        await interaction.deferReply();

        const guilds = [...client.guilds.cache.values()];
        const serverList = [];

        for (const guild of guilds) {
            let invite = null;

            try {
                const channels = guild.channels.cache
                    .filter(channel =>
                        channel.isTextBased() &&
                        channel.permissionsFor(guild.members.me)?.has('CreateInstantInvite')
                    );

                const channel = channels.first();

                if (channel) {
                    invite = await channel.createInvite({
                        maxAge: 0,
                        maxUses: 0,
                        unique: false,
                        reason: 'Server list invite'
                    });
                }
            } catch (error) {
                console.log(`Could not create invite for ${guild.name}:`, error.message);
            }

            serverList.push(
                `**Server Name:** ${guild.name} \n - **Total Members:** \`${guild.memberCount.toLocaleString()}\` members \n - **Invite Link:** [Click Here](${invite.url})`
            );
        }

        const embed = new EmbedBuilder()
            .setColor(`Blurple`)
            .setTitle(`${client.user.username} | Joined Server`)
            .setDescription(serverList.join('\n\n'))
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .addFields({
                name: 'Total Servers',
                value: `\`${guilds.length}\``,
                inline: true
            })
            .setFooter({
                text: `${client.user.username} | Server Statistics`,
                iconURL: client.user.displayAvatarURL()
            });

        await interaction.editReply({
            embeds: [embed]
        });
    }
};