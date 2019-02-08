class RoleHealer {
    constructor() {
        this.name = 'Healer'
        this.priority = 7
        this.prespawn = 400
    }
    getPriority(room) {
        return this.priority
    }
    getName() {
        return this.name
    }
    getPrespawn() {
        return this.prespawn
    }
    getMaximum(room) {
        if (room.level >= 7) {
            return 0
        }
        return 0
        return 0 + room.threatLevel - 1
    }
    getBuild(room) {
        return [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
    }
    work(healer) {
        if (!healer.memory.boosted) {
            if (healer.pos.isEqualTo(Game.flags.fill)) {
                healer.moveTo(Game.flags.fill2)
                healer.memory.boosted = true
            }
            healer.moveTo(Game.flags.fill)
        }
        if (healer.pos.roomName !== Game.flags.attack.pos.roomName || healer.pos.x === 0 || healer.pos.y === 0 || healer.pos.y === 49 || healer.pos.x === 49) {
            let path = PathFinder.search(healer.pos, Game.flags.attack.pos, {
                roomCallback: roomName => {
                    if (['E16S36', 'E15S36', 'E16S35', 'E16S34', 'E16S32', 'E19S31'].includes(roomName)) {
                        return false
                    }
                    let room = Game.rooms[roomName]
                    if (!room) {
                        return
                    }
                    let costs = new PathFinder.CostMatrix;
                    room.find(FIND_STRUCTURES).forEach(function (struct) {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            // Favor roads over plain tiles
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // Can't walk through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });

                    // Avoid creeps in the room
                    room.find(FIND_CREEPS).forEach(function (creep) {
                        costs.set(creep.pos.x, creep.pos.y, 0xff);
                    });

                    return costs;
                }

            }).path
            let damagedCreep = healer.pos.findInRange(FIND_MY_CREEPS, 3).filter(creep => creep.hits < creep.hitsMax)[0]
            if (damagedCreep) {
                healer.rangedHeal(damagedCreep)
            }
            if (healer.hits < healer.hitsMax) {
                healer.heal(healer)
            }
            healer.moveByPath(path)

            return
        }

        healer.moveTo(Game.flags.attack)
    }
}

module.exports = new Rolehealer