module.exports = packet => {
    return packet.prev(1).name === 'C_GET_USER_LIST';
}