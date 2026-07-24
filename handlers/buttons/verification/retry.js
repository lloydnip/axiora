const {
    EmbedBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { createCaptcha } = require("../../../utils/veriicationCode");

const {
    getSession,
    createSession
} = require("../../../utils/verificationSessions");

module.exports = {
    customId: "verification_retry",
    async execute(interaction) {
        const { client } = interaction
        try {
            const session = getSession(interaction.user.id);

            if (!session) {
                return interaction.reply({
                    content: "❌ Your verification session has expired.\n\n" + "Please return to the server and press **Verify** again.",
                    ephemeral: true
                });
            }

            const captcha = await createCaptcha();

            createSession(interaction.user.id, {
                    guildId: session.guildId,
                    captcha: captcha.answer,
                    attempts: 0,
                    createdAt: Date.now(),
                    expiresAt:
                        Date.now() +
                        5 * 60 * 1000
                }
            );

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("🔄 New CAPTCHA")
                .setDescription(
                    "A new CAPTCHA has been generated.\n\n" +
                    "Reply to this DM with the **6-character code** shown in the image.\n\n" +
                    "⏳ This CAPTCHA expires in **5 minutes**.\n" +
                    "🔄 You have **3 attempts**."
                )
                .setFooter({
                    text: "Axiora Security",
                    iconURL: Client.user.displayAvatarURL()
                })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("verification_retry")
                        .setLabel("New CAPTCHA")
                        .setEmoji("🔄")
                        .setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
                        .setCustomId("verification_cancel")
                        .setLabel("Cancel")
                        .setEmoji("❌")
                        .setStyle(ButtonStyle.Danger)

                    );

            await interaction.update({
                embeds: [embed],
                components: [row]
            });

        } catch (error) {
            console.error("CAPTCHA Retry Error:", error);

            if (
                interaction.replied ||
                interaction.deferred
            ) {
                return interaction.editReply({
                    content:"❌ Failed to generate a new CAPTCHA."
                }).catch(
                    () => {}
                );
            }

            return interaction.reply({
                content: "❌ Failed to generate a new CAPTCHA.",
                ephemeral: true
            });
        }
    }
};
