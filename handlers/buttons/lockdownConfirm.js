module.exports = {

    customId: "lockdown_confirm",

    async execute(interaction) {

        await interaction.reply({
            content: "Confirmed!"
        });

    }

};