module.exports = packet => {
    return packet.prev(2).name === 'S_LOAD_CLIENT_ACCOUNT_SETTING'
        && packet.parsedLength === 8;
}