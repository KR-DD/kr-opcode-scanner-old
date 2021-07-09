module.exports = packet => {
    return packet.prev(1).name === 'C_CHECK_VERSION'
        && packet.packetCount === 2;
}