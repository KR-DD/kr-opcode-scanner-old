module.exports = packet => {
    return packet.prev(1).name === 'C_SET_VISIBLE_RANGE'
        && packet.parsedLength === 4;
}