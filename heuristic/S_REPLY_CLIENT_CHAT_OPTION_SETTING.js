module.exports = packet => {
    const result = packet.parsedRaw.tabs.find(x => x.defaultInputChannel === 'CHATTYPE_NORMAL' || x.defaultInputChannel === 'CHATTYPE_GENERAL');

    return result;
}