module.exports = packet => {
    const comparePacket = packet.mappedList['S_GET_USER_LIST'];
    if (!comparePacket) return false;
    
    const result = comparePacket.parsedRaw.characters.find(x =>
        packet.parsedRaw.playerId === x.id && packet.parsedRaw.guildId === x.guildLogoId
    )

    return result;
}