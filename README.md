# opcode-scanner
tera-toolbox module to scan opcodes using modular heuristics for K-Tera

based off https://github.com/ylennia-archives/opcode-scanner

## Usage
- Requires modular heuristic files in `heuristic` folder
- Requires custom definition files to be added to tera-toolbox in `TeraToolbox/data/definitions` folder
- Generates protocol.version.map file in `TeraToolbox/data/opcodes` folder

## Heuristic
`heuristic` folder contains modular heuristic js files used to scan incoming and outgoing packets.

Packets are of the following key-values :
- `code` : opcode specified to packet
- `name` : name of opcode
- `data` : raw data
- `fromServer` : boolean, `true` for incoming server packets
- `packetCount` : count of all packet
- `parsedRaw` : parsed data based on packet definition
- `parsedLength` : parsed length
- `mappedList` : key(name)-values(packet) array oof currently mapped opcodes
- `history` : array of all Packets

### Example
C_CHAT(outdated) :
```js
module.exports = packet => {
  // packet order check
  if (!packet.mapped['S_CHAT'] ||
    packet.parsed.channel >>> 0 >= 300) {
    return false;
  }

  // retrospectively check on subsequent packets
  for (let i = packet.index + 1; i < packet.history.length; i++) {
    let next = packet.history[i];

    if (next.name() === 'S_CHAT' &&
      next.time - packet.time < 500 &&
      packet.parsed.channel === next.parsed.channel &&
      packet.parsed.message === next.parsed.message) {
      return true;
    }
  }

  return false;
}
```

S_CHAT(outdated) :
```js
module.exports = packet => { // 3
  // packet order check
  let prev = packet.prev('S_LOGIN');

  // returns whether packet is a heuristic match
  return prev &&
    packet.parsed.channel >>> 0 < 300 &&
    packet.parsed.gameId === prev.parsed.gameId &&
    packet.parsed.name == prev.parsed.name &&
    packet.parsed.message.startsWith('<FONT');
}
```

## Minimum opcode list for Shinra Meter
<details>

  - C_CHECK_VERSION
  - C_PLAYER_LOCATION
  - S_ABNORMALITY_BEGIN
  - S_ABNORMALITY_END
  - S_ABNORMALITY_REFRESH
  - S_ACTION_END
  - S_ACTION_STAGE
  - S_AVAILABLE_EVENT_MATCHING_LIST
  - S_BAN_PARTY
  - S_BAN_PARTY_MEMBER
  - S_BATTLE_FIELD_ENTRANCE_INFO
  - S_BOSS_GAGE_INFO
  - S_CHANGE_DESTPOS_PROJECTILE
  - S_CHAT
  - S_CHECK_TO_READY_PARTY
  - S_CREATURE_CHANGE_HP
  - S_CREATURE_LIFE
  - S_CREATURE_ROTATE
  - S_CREST_INFO
  - S_CREST_MESSAGE
  - S_DESPAWN_NPC
  - S_DESPAWN_USER
  - S_EACH_SKILL_RESULT
  - S_FIN_INTER_PARTY_MATCH
  - S_GET_USER_GUILD_LOGO
  - S_GET_USER_LIST
  - S_INSTANT_DASH
  - S_INSTANT_MOVE
  - S_LEAVE_PARTY
  - S_LEAVE_PARTY_MEMBER
  - S_LOAD_TOPO
  - S_LOGIN
  - S_MOUNT_VEHICLE_EX
  - S_NPC_LOCATION
  - S_NPC_OCCUPIER_INFO
  - S_NPC_STATUS
  - S_OTHER_USER_APPLY_PARTY
  - S_PARTY_MEMBER_CHANGE_HP
  - S_PARTY_MEMBER_LIST
  - S_PARTY_MEMBER_STAT_UPDATE
  - S_PLAYER_CHANGE_MP
  - S_PLAYER_STAT_UPDATE
  - S_PRIVATE_CHAT
  - S_REQUEST_CONTRACT
  - S_RETURN_TO_LOBBY
  - S_SPAWN_ME
  - S_SPAWN_NPC
  - S_SPAWN_PROJECTILE
  - S_SPAWN_USER
  - S_START_COOLTIME_SKILL
  - S_START_USER_PROJECTILE
  - S_SYSTEM_MESSAGE
  - S_TRADE_BROKER_DEAL_SUGGESTED
  - S_UPDATE_NPCGUILD
  - S_USER_LOCATION
  - S_USER_STATUS
  - S_WEAK_POINT
  - S_WHISPER
  
</details>

## Changelog
<details>

nothing yet.

</details>
