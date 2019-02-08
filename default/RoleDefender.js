class RoleDefender {
    constructor() {
        this.name = 'Defender'
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
        if (room.level >= 7 && Game.rooms[room.name].storage.store.energy > 20000) {
            return 0
        }
        return 0
        return 0 + room.threatLevel - 1
    }
    getBuild(room) {
        return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE]
    }
    work(defender) {

        defender.rangedMassAttack()
        if (defender.pos.roomName !== Game.flags.defend.pos.roomName || defender.pos.x === 0 || defender.pos.y === 0 || defender.pos.y === 49 || defender.pos.x === 49) {
            let path = PathFinder.search(defender.pos, Game.flags.defend.pos, {
                roomCallback: roomName => {
                    if (['E16S35', 'E16S34', 'E16S32', 'E19S32', 'E22S34'].includes(roomName)) {
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
            let damagedCreep = defender.pos.findInRange(FIND_MY_CREEPS, 3).filter(creep => creep.hits < creep.hitsMax)[0]
            if (damagedCreep) {
                defender.rangedHeal(damagedCreep)
            }
            if (defender.hits < defender.hitsMax) {
                defender.heal(defender)
            }
            defender.moveByPath(path)

            return
        }
        let hostileCreep = defender.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: creep => creep.owner.username === 'Tigga'
        })
        let damagedCreep = defender.pos.findInRange(FIND_MY_CREEPS, 1).filter(creep => creep.hits < creep.hitsMax)[0]
        if (damagedCreep) {
            defender.heal(damagedCreep)
        }
        if (defender.hits < defender.hitsMax) {
            defender.heal(defender)
        }
        defender.rangedMassAttack()

        if (hostileCreep) {
            let outcome = defender.rangedAttack(hostileCreep)
            if (outcome === ERR_NOT_IN_RANGE) {
                defender.moveTo(hostileCreep, {
                    reusePath: 1
                })
                return
            }
            //defender.moveTo(hostileCreep,{reusePath:1})
            return
        }
        defender.moveTo(Game.flags.defend)

    }
}

module.exports = new RoleDefender