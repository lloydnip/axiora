const {
    AttachmentBuilder
} = require("discord.js");

async function createTranscript(channel) {

    let messages = [];

    let lastId;

    while (true) {

        const options = {
            limit: 100
        };

        if (lastId) {
            options.before = lastId;
        }

        const fetched =
            await channel.messages.fetch(
                options
            );

        if (fetched.size === 0) {
            break;
        }

        messages.push(
            ...fetched.values()
        );

        lastId =
            fetched.last().id;

        if (fetched.size < 100) {
            break;
        }
    }

    messages.reverse();

    let transcript = "";

    transcript +=
        `Axiora Ticket Transcript\n`;

    transcript +=
        `========================\n`;

    transcript +=
        `Server: ${channel.guild.name}\n`;

    transcript +=
        `Channel: #${channel.name}\n`;

    transcript +=
        `Channel ID: ${channel.id}\n`;

    transcript +=
        `Created: ${channel.createdAt.toISOString()}\n`;

    transcript +=
        `Closed: ${new Date().toISOString()}\n`;

    transcript +=
        `========================\n\n`;

    for (const message of messages) {

        const date =
            message.createdAt.toISOString();

        const author =
            `${message.author.tag} (${message.author.id})`;

        transcript +=
            `[${date}] ${author}:\n`;

        if (message.content) {
            transcript +=
                `${message.content}\n`;
        }

        if (message.attachments.size > 0) {

            transcript +=
                `Attachments:\n`;

            for (
                const attachment
                of message.attachments.values()
            ) {

                transcript +=
                    `- ${attachment.url}\n`;
            }
        }

        transcript +=
            `\n`;
    }

    const buffer =
        Buffer.from(
            transcript,
            "utf-8"
        );

    return new AttachmentBuilder(
        buffer,
        {
            name:
                `${channel.name}-transcript.txt`
        }
    );
}

module.exports = {
    createTranscript
};
