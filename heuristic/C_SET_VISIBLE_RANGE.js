module.exports = packet => {
    return packet.prev(1).name === 'S_LOGIN_ACCOUNT_INFO'
        && packet.parsedLength === 8;
}