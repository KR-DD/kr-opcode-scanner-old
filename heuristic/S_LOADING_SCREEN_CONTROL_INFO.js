module.exports = packet => {
    return packet.prev(1).name === 'S_CHECK_VERSION'
        && (packet.parsedRaw.enableCustom || !packet.parsedRaw.enableCustom);
}