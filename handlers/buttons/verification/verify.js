const {
    EmbedBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { getConfig } = require("../../../utils/verification");
const { createCaptcha } = require("../../../utils/captcha");

const {
    createSession,
    hasSession,
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

            if (!config.enabled) {
                return interaction.editReply({
                    content: "❌ Verification is disabled."
                });
            }

            if (!config.role) {
                return interaction.editReply({
                    content: "❌ No verification role has been configured."
                });
            }

            if (interaction.member.roles.cache.has(config.role)) {
                return interaction.editReply({
                    content: "✅ You are already verified."
                });
            }

            if (hasSession(interaction.user.id)) {
                return interaction.editReply({
                    content: "❌ You already have an active verification session. Check your DMs."
                });
            }

            // Generate CAPTCHA
            const captcha = await createCaptcha();

            // Create verification session
            createSession(interaction.user.id, {
                guildId: interaction.guild.id,
                captcha: captcha.answer,
                attempts: 0,
                createdAt: Date.now()
            });

            const attachment = new AttachmentBuilder(captcha.image, {
                name: "captcha.png"
            });

const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setAuthor({
        name: "Axiora Verification",
        iconURL: interaction.client.user.displayAvatarURL()
    })
    .setTitle("🛡 Complete Verification")
    .setDescription(
`Welcome to **${interaction.guild.name}**!

Please type the **6-character code** shown in the image below.

### Rules
• ⏳ Expires in **5 minutes**
• 🔄 Maximum **3 attempts**
• 💬 Reply in this DM with only the code

Good luck!`
    )
    .setImage("attachment://captcha.png")
    .setFooter({
        text: "Axiora Security • CAPTCHA Verification"
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

            // Send DM
            try {

    await interaction.user.send({
        embeds: [embed],
        files: [attachment],
        components: [row]
    });

} catch (err) {

    console.error("DM Error:");
    console.error(err);

    deleteSession(interaction.user.id);

    return interaction.editReply({
        content: "❌ I couldn't send you a DM. Please enable Direct Messages."
    });

}

            // Respond to button interaction
            await interaction.editReply({
                content: "📩 Check your Direct Messages to continue verification."
            });

            // Expire after 5 minutes
            setTimeout(async () => {

                if (!hasSession(interaction.user.id))
                    return;

                deleteSession(interaction.user.id);

                try {

                    await interaction.user.send({

                        embeds: [

                            new EmbedBuilder()

                                .setColor("Red")

                                .setTitle("⌛ Verification Expired")

                                .setDescription(
                                    "Your verification session has expired.\n\nPlease return to the server and press **Verify** again."
                                )

                        ]

                    });

                } catch (err) {
                    console.error("Failed to send expiration DM:", err);
                }

            }, 300000);

        } catch (err) {

            console.error("Verification Error:", err);

            deleteSession(interaction.user.id);

            if (interaction.deferred || interaction.replied) {

                await interaction.editReply({
                    content: "❌ I couldn't send you a DM.\n\nPlease enable **Direct Messages** from this server and try again."
                }).catch(() => {});

            } else {

                await interaction.reply({
                    content: "❌ I couldn't send you a DM.",
                    ephemeral: true
                }).catch(() => {});

            }

        }

    }

};