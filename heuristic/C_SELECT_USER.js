module.exports = packet => {
    const comparePacket = packet.mappedList['S_GET_USER_LIST'];
    if (!comparePacket) return false;
    
    const result = comparePacket.parsedRaw.characters.find(x =>
        packet.parsedRaw.id === x.id && packet.parsedRaw.unk === 0
    )

    return result && packet.parsedLength === 9;
}