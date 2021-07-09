module.exports = packet => {
    return packet.prev(1).name === 'S_GET_USER_LIST'
        && packet.parsedLength > 1000;
}