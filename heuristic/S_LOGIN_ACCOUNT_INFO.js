module.exports = packet => {
    return packet.parsedLength > 100
        && packet.parsedRaw.dbServerName.startsWith('PlanetDB');
}