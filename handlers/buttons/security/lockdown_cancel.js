const {
    loadJSON,
    saveJSON
} = require("../../../utils/database");

module.exports = {
    customId: "lockdown_cancel",

    async execute(interaction) {

        const db =
            loadJSON("security.json");

        const guildId =
            interaction.guild.id;

        if (
            db[guildId]?.lockdown
        ) {

            delete db[
                guildId
            ].lockdown.pending;

            saveJSON(
                "security.json",
                db
            );
        }

        await interaction.update({
            content:
                "❌ Lockdown cancelled.",
            embeds: [],
            components: []
        });
    }
};
