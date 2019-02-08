const ServiceCreeps = require('ServiceCreeps')
class RoleUpgrader {
    constructor() {
        this.name = 'Upgrader'
        this.priority = 8
        this.prespawn = 60
    }
    getPriority(room) {
        return this.priority
    }
    getPrespawn() {
        return this.prespawn
    }
    getName() {
        return this.name
    }
    getMaximum(room) {
        if (room.underAttack) {
            return 1
        }
        if (room.level === 8) {
            return 1
        }
        if (room.level < 4) {
            return 6
        }
        if (room.level >= 4 && Game.rooms[room.name].storage) {
            if (Game.rooms[room.name].storage.store.energy < 100000) {
                return 1
            }
            return 2
        }
        return 2
    }
    getBuild(room) {
        let capacity = room.energyCapacityAvailable

        let build = [CARRY, CARRY, CARRY, WORK, MOVE]
        switch (true) {
            case capacity > 2500:
                build = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
                break
            case capacity > 1200:
                build = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
                break
            case capacity > 700:
                build = [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
                break
            case capacity > 450:
                build = [WORK, WORK, WORK, CARRY, CARRY, MOVE]
                break
        }
        return build
    }
    work(creep){
        switch (creep.memory.state) {
            case CREEP_UPGRADING:
                if (!ServiceCreeps.upgrading(creep)) {
                    creep.memory.state = CREEP_IDLE
                }
                break;
            case CREEP_COLLECTING:
                if (ServiceCreeps.collecting(creep)) {
                    creep.memory.state = CREEP_MOVE_TO_CONTROLLER
                } else {
                    creep.memory.state = CREEP_IDLE
                    creep.memory.target = ''
                }
                break;
            case CREEP_MOVE_TO_TARGET:
                if (!ServiceCreeps.moveToTarget(creep)) {
                    creep.memory.state = CREEP_COLLECTING
                }
                break;
            case CREEP_MOVE_TO_DESTINATION:
                console.log('dog')
                if (!ServiceCreeps.moveToController(creep)) {
                    console.log('whit')
                    creep.memory.state = CREEP_UPGRADING
                }
                break;
            default:
                if (creep.carry.energy > 0) {
                    creep.memory.state = CREEP_MOVE_TO_CONTROLLER
                } else if (creep.carry.energy === 0 && creep.memory.target) {
                    creep.memory.state = CREEP_MOVE_TO_TARGET
                }
                break;
        }
    }
}

module.exports = new RoleUpgrader