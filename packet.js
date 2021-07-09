class Packet {
    constructor(packet) {
        Object.assign(this, packet);
    }

    prev(count) {
        return this.history[this.packetCount - 1 - count];
    }
}
module.exports = Packet;