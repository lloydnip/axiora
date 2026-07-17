const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const embedManager = require("./embedManager");

const {
    replaceVariables
} = require("./variables");

function buildWelcomeEmbed(member) {
    const config = embedManager.load(
        "welcome");

    const embed = new EmbedBuilder()
        .setColor(config.color || "#5865F2");

    if (config.author?.text) {
        embed.setAuthor({
            name: replaceVariables(
                config
                .author
                .text,
                member),
            iconURL: replaceVariables(
                    config
                    .author
                    .icon,
                    member) ||
                undefined
        });
    }

    if (config.title) {
        embed.setTitle(replaceVariables(
            config.title, member
        ));
    }

    if (config.description) {
        embed.setDescription(
            replaceVariables(config
                .description, member
            ));
    }

    if (config.thumbnail) {
        embed.setThumbnail(
            replaceVariables(config
                .thumbnail, member));
    }

    if (config.image) {
        embed.setImage(replaceVariables(
            config.image, member
        ));
    }

    if (config.footer?.text || config
        .footer?.icon) {
        embed.setFooter({
            text: replaceVariables(
                config
                .footer
                .text || "",
                member),
            iconURL: replaceVariables(
                    config
                    .footer
                    .icon,
                    member) ||
                undefined
        });
    }

    if (config.timestamp) {
        embed.setTimestamp();
    }

    const rows = [];
    if (Array.isArray(config.buttons) &&
        config.buttons.length > 0) {
        let row =
            new ActionRowBuilder();
        for (const button of config
                .buttons) {
            if (row.components
                .length === 5) {
                rows.push(row);
                row =
                    new ActionRowBuilder();
            }
            const btn =
                new ButtonBuilder()
                .setLabel(
                    replaceVariables(
                        button.label,
                        member))
                .setStyle(ButtonStyle
                    .Link).setURL(button
                    .url);
            if (button.emoji) {
                btn.setEmoji(button
                    .emoji);
            }
            row.addComponents(btn);
        }
        if (row.components.length > 0) {
            rows.push(row);
        }
    }

    if (Array.isArray(config.fields)) {
        for (const field of config
                .fields) {
            embed.addFields({
                name: replaceVariables(
                    field
                    .name,
                    member),
                value: replaceVariables(
                    field
                    .value,
                    member),
                inline: field
                    .inline ??
                    false
            });
        }
    }
    return {
        content: config.content ?
            replaceVariables(config
                .content, member) : null,
        embeds: [embed],
        components: rows
    };
}
module.exports = buildWelcomeEmbed;
