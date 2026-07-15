const {
    EmbedBuilder,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { createCaptcha } = require("../../../utils/captcha");

const {
    getSession,
    createSession
} = require("../../../utils/verificationSessions");

module.exports = {

    customId: "verification_retry",

    async execute(interaction) {

        const session = getSession(interaction.user.id);

        if (!session) {

            return interaction.reply({

                content:
                    "❌ Your verification session has expired.",

                ephemeral: true

            });

        }

        const captcha = await createCaptcha();

        createSession(interaction.user.id, {

            guildId: session.guildId,

            captcha: captcha.answer,

            attempts: session.attempts,

            createdAt: Date.now()

        });

        const attachment = new AttachmentBuilder(captcha.image, {

            name: "captcha.png"

        });

        const embed = new EmbedBuilder()

            .setColor("Blue")

            .setTitle("🔄 New CAPTCHA")

            .setDescription(

                "Reply with the new CAPTCHA shown below."

            )

            .setImage("attachment://captcha.png");

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

            files: [attachment],

            components: [row]

        });

    }

};