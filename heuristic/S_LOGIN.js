module.exports = packet => {
    return packet.parsedLength > 500
        && 65 <= packet.parsedRaw.level
        && packet.parsedRaw.level <= 70;
}