async function punish(member, type, reason = "Anti-Nuke Protection") {

    switch (type) {

        case "ban":

            return member.ban({
                reason
            });

        case "kick":

            return member.kick(reason);

        case "timeout":

            return member.timeout(
                1000 * 60 * 60 * 24,
                reason
            );

        case "strip_roles":

            const roles = member.roles.cache
                .filter(role =>
                    role.id !== member.guild.id &&
                    role.editable
                )
                .map(role => role.id);

            if (roles.length)
                await member.roles.remove(
                    roles,
                    reason
                );

            break;

    }

}

module.exports = {
    punish
};
