const { time } = require("discord.js");

function replaceVariables(text, member) {

    if (!text) return "";

    const joinerAvatar = member.displayAvatarURL({
        extension: "png",
        size: 1024
    });


    return text

        // User
        .replace(
            /{mention}/gi,
            `${member}`
        )

        .replace(
            /{username}/gi,
            member.user.username
        )

        .replace(
            /{displayname}/gi,
            member.displayName
        )

        .replace(
            /{tag}/gi,
            member.user.tag
        )

        .replace(
            /{id}/gi,
            member.id
        )


        // Joiner Avatar (all use the member who joined)
        .replace(
            /{avatar}/gi,
            joinerAvatar
        )

        .replace(
            /{useravatar}/gi,
            joinerAvatar
        )

        .replace(
            /{joineravatar}/gi,
            joinerAvatar
        )


        // Server
        .replace(
            /{server}/gi,
            member.guild.name
        )

        .replace(
            /{membercount}/gi,
            member.guild.memberCount.toString()
        )


        // Dates
        .replace(
            /{created}/gi,
            time(member.user.createdAt, "F")
        )

        .replace(
            /{createdR}/gi,
            time(member.user.createdAt, "R")
        )

        .replace(
            /{joined}/gi,
            member.joinedAt
                ? time(member.joinedAt, "F")
                : "Unknown"
        )

        .replace(
            /{joinedR}/gi,
            member.joinedAt
                ? time(member.joinedAt, "R")
                : "Unknown"
        );

}


module.exports = {
    replaceVariables
};
