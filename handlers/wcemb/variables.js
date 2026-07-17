const { EmbedBuilder } = require("discord.js");

module.exports = {

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📖 Welcome Embed Variables")
            .setDescription(
                "Use the following placeholders anywhere in your welcome embed."
            )

            .addFields(
                {
                    name: "👤 User",
                    value: [
                        "`{mention}` → Mention the user",
                        "`{username}` → Username",
                        "`{displayname}` → Server display name",
                        "`{tag}` → Username#0000",
                        "`{id}` → User ID",
                        "`{avatar}` → User avatar"
                    ].join("\n")
                },
                {
                    name: "🏠 Server",
                    value: [
                        "`{server}` → Server name",
                        "`{membercount}` → Member count",
                        "`{serverAvatar}` → Server avatar"
                    ].join("\n")
                },
                {
                    name: "📅 Dates",
                    value: [
                        "`{created}` → Discord account creation date",
                        "`{createdR}` → Relative account creation",
                        "`{joined}` → Server join date",
                        "`{joinedR}` → Relative server join date"
                    ].join("\n")
                }
            )

            .setFooter({
                text: "Axiora • Welcome Variables"
            })

            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};