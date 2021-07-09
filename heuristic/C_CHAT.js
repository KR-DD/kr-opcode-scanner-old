module.exports = packet => {
    return packet.mappedList['S_LOGIN']
        && packet.parsedRaw.channel < 10
        && packet.parsedRaw.message.startsWith('<FONT');
}