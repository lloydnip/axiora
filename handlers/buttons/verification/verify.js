const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const {
    getConfig
} = require("../../../utils/verification");

const {
    createVerificationCode
} = require("../../../utils/verificationCode");

const {
    createSession,
    getSession,
    deleteSession
} = require("../../../utils/verificationSessions");


module.exports = {
    customId: "verification_verify",
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        try {
            const config = getConfig(interaction.guild.id);

            if (
                !config ||
                !config.enabled
            ) {
                const aembed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`:warning: | Verification is disabled.`)

                return interaction.editReply({
                    embeds: [aembed],
                    ephemeral: true
                });
            }

            if (
                !config.role
            ) {
                const bembed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`:warning: | Verification Role is not configured.`)

                return interaction.editReply({
                    embeds: [bembed],
                    ephemeral: true
                });
            }

            if (interaction.member.roles.cache.has(config.role)
            ) {
                const cembed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`:white_check_mark: | You are already verified.`)

                return interaction.editReply({
                    embeds: [cembed],
                    ephemeral: true
                });
            }

            const existingSession = getSession(interaction.user.id);

            if (
                existingSession
            ) {
                const cembed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`:x: | You are already have an active verification session. Please check your DMs.`)

                return interaction.editReply({
                    embeds: [cembed],
                    ephemeral: true
                });

            }

            const code = createVerificationCode();
            const sessionId = `${interaction.user.id}-${Date.now()}`;
            const expiresAt = Date.now() + 5 * 60 * 1000;

            createSession(interaction.user.id,
                {
                    guildId: interaction.guild.id,
                    code: code,
                    attempts: 0,
                    createdAt: Date.now(),
                    expiresAt: expiresAt,
                    sessionId: sessionId
                }
            );

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🛡 Complete Verification")
                .setDescription(
                    `Welcome to **${interaction.guild.name}**!\n\n` +
                    `Your verification code is:  \`${code}\`` +
                    "Reply to this DM with **only the 6-digit code**.\n" +
                    "## Rules\n" +
                    "• ⏳ Code expires in **5 minutes**\n" +
                    "• 🔄 Maximum **3 attempts**\n" +
                    "• 💬 Reply with only the code"
                )
                .setFooter({
                    text: "Axiora Security",
                    iconURL: interaction.guild.iconURL()
                })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("verification_retry")
                        .setLabel("New Code")
                        .setEmoji("🔄")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId("verification_cancel")
                        .setLabel("Cancel")
                        .setEmoji("❌")
                        .setStyle(ButtonStyle.Danger)
                    );

            try {
                await interaction.user.send({
                    embeds: [embed],
                    components: [row]
                });

            } catch (error) {

                console.error("DM Error:", error);

                deleteSession(interaction.user.id);

                return interaction.editReply({
                    content: "❌ I couldn't send you a DM.\n\n" + "Please enable Direct Messages from this server and try again.",
                    ephemeral: true
                });

            }

            await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle("📩 Check Your DMs")
                        .setDescription(
                            "I've sent you a verification code in your DMs.\n\n" +
                            "Reply to the DM with **only the 6-digit code**."
                        )
                        .setFooter({
                            text: "Axiora Security",
                            iconURL: interaction.guild.iconURL()
                        })
                        .setTimestamp()
                ]
            });

            setTimeout(
                async () => {
                    const session = etSession(interaction.user.id);

                    if (
                        !session
                    ) {
                        return;
                    }

                    if (
                        session.sessionId !==
                        sessionId
                    ) {
                        return;
                    }

                    deleteSession(interaction.user.id);

                    try {
                        await interaction.user.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("⌛ Verification Code Expired")
                                    .setDescription(
                                        "Your verification code has expired.\n\n" +
                                        "Return to the server and click **Verify** to request a new code."
                                    )
                                    .setFooter({
                                        text: "Axiora Security",
                                        iconURL: interaction.guild.iconURL()
                                    })
                                    .setTimestamp()
                            ]
                        });
                    } catch (error) {
                        console.error("Expiration DM Error:", error);
                    }
                },
                5 * 60 * 1000
            );

        } catch (error) {
            console.error("Verification Error:", error);

            deleteSession(interaction.user.id);

            await interaction.editReply({
                content: "❌ Something went wrong while starting verification."
            }).catch(
                () => {}
            );
        }
    }
};
