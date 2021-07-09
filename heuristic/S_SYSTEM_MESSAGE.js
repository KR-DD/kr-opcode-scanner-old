module.exports = packet => {
    return packet.mappedList['S_LOGIN']
        && /^@\d+/.test(packet.parsedRaw.message);
}