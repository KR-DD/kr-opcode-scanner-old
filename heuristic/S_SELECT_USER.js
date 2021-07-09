module.exports = packet => {
    return packet.prev(1).name === 'C_SELECT_USER'
        && packet.parsedLength === 15;
}