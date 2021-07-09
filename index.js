const path = require('path');
const fs = require('fs');
const Packet = require('./packet.js');

const TEMPORARY_OPCODE = 65535;

class Scanner {
    constructor(mod) {
        this.mod = mod;

        this.mappedList = {}; // key: opcodeName, value: packet
        this.unmappedList = {};
        this.ignoreOpcodeList = {};

        this.packetCount = 0;
        this.packetHistory = [];

        this.characterList = [];

        this.isScanning = false;
        this.scanIndex = 0;
        this.maxScanLength = 50;

        const version = mod.clientInterface.info.protocolVersion;
        this.mapDir = path.join(__dirname, '..', '..', 'data/opcodes', 'protocol.' + version + '.map');

        if (mod.clientInterface.info.language !== 'kor') {
            console.error('#################### notify ####################');
            console.log('This module is for K-Tera.')
            console.log('some heuristics could be make error in another region.\n\n\n')
        }

        // load heuristic items
        let items = fs.readdirSync(path.join(__dirname, 'heuristic')).filter(name => name.endsWith('js'));
        for (let item of items) {
            item = item.slice(0, item.indexOf('.')) || item;

            if (mod.dispatch.protocolMap.name.get(item) == undefined) {
                this.unmappedList[item] = require('./heuristic/' + item);
                mod.dispatch.protocolMap.name.set(item, TEMPORARY_OPCODE);
            }
        }
        console.log('Opcode scanner initialized, loaded ' + Object.keys(items).length + '/' + items.length + ' items.');

        // hook opcodes
        mod.hook('*', 'raw', { order: -99999999 }, (code, data, fromServer) => {
            let packet = new Packet({
                code,
                name: null,
                data,
                fromServer,
                packetCount: ++this.packetCount,
                parsedRaw: null,
                parsedLength: 0,
                mappedList: this.mappedList,
                history: this.packetHistory,
            })
            this.packetHistory.push(packet);
        });

        this.scanInterval = mod.setInterval(() => {
            if (this.unmappedList.length === 0) {
                mod.clearInterval(this.scanInterval);
                console.log('--- All opcodes found. ---');
            } else {
                if (!this.isScanning) {
                    this.process();
                }
            }
        }, 3000);
    }

    async process() {
        this.isScanning = true;

        const maxLoop = this.scanIndex + this.maxScanLength < this.packetHistory.length ? this.scanIndex + this.maxScanLength : this.packetHistory.length;

        if (this.scanIndex === maxLoop) {

        } else {
            console.log('----- processing ' + this.scanIndex + '~' + maxLoop + ' ----- (max: ' + this.packetHistory.length + ')');

            for (let i = this.scanIndex; i < maxLoop; i++) {
                const packet = this.packetHistory[i];

                if (!this.ignoreOpcodeList[packet.code] || this.ignoreOpcodeList[packet.code] !== 3) {
                    await this.scan(packet)
                }

                this.scanIndex++;
            }
        }
        this.isScanning = false;
    }

    scan(packet) {
        return new Promise(async resolve => {
            let name = this.mod.dispatch.protocolMap.code.get(packet.code);
            if (name) {
                packet.name = name;
                this.isFirstFound(name, packet);
                resolve();
            } else {
                const delimiter = packet.fromServer ? 'S_' : 'C_';

                for (let heuristic in this.unmappedList) {
                    if (heuristic.startsWith(delimiter)) {
                        try {
                            await this.parse(packet, heuristic);
                        } catch (error) {
                            continue;
                        }

                        this.debug(packet);

                        if (this.unmappedList[heuristic](packet)) {
                            if (packet.parsedLength === packet.data.length) {
                                console.log('Opcode found: ' + heuristic + ' = ' + packet.code);

                                delete this.unmappedList[heuristic];

                                packet.name = heuristic;

                                this.writeMap();
                                break;
                            } else {
                                packet.parsedRaw = null;
                                packet.parsedLength = 0;
                            }
                        }
                    }
                }

                if (packet.name) {
                    this.isFirstFound(packet.name, packet);
                } else {
                    let ignoreOpcode = this.ignoreOpcodeList[packet.code];

                    if (ignoreOpcode) {
                        this.ignoreOpcodeList[packet.code] += 1;
                    } else {
                        this.ignoreOpcodeList[packet.code] = 1;
                    }
                }
                resolve();
            }
        });
    }

    parse(packet, heuristic) {
        return new Promise(resolve => {
            try {
                packet.parsedRaw = this.mod.dispatch.fromRaw(heuristic, '*', packet.data);
                packet.parsedLength = this.mod.dispatch.toRaw(heuristic, '*', packet.parsedRaw).length;
                resolve();
            } catch {
                packet.parsedRaw = null;
                packet.parsedLength = 0;
                reject();
            }
        });
    }

    isFirstFound(name, packet) {
        if (!this.mappedList[name]) {
            if (!packet.parsedRaw) {
                this.parse(packet, packet.name);
            }
            this.mappedList[name] = packet;
        }
    }

    writeMap() {
        let res = [];

        for (let name in this.mappedList) {
            res.push(name + ' = ' + this.mappedList[name].code);
            res.sort();
        }

        fs.writeFileSync(this.mapDir, res.join('\n'));
    }

    debug(packet) {
        if (packet.code === 0) {
            console.log(packet.code + ' [' + packet.parsedLength + ']');
            console.log(packet.parsedRaw);
        }
    }

    sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}
module.exports = { NetworkMod: Scanner };