let ServiceCreeps = require('ServiceCreeps')
let RepositoryStructures = require('RepositoryStructures')
class RoleCarrier {
    constructor() {
        this.name = 'Carrier'
        this.priority = 12
        this.prespawn = 20
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
        if (Game.cpu.bucket < 5000) {
            return 1
        }
        let linksMineCount = RepositoryStructures.getLinksMineCount(room.name)
        if (!Game.rooms[room.name].storage && !linksMineCount) {
            return 5
        }
        if (Game.rooms[room.name].storage && linksMineCount) {
            return 3 - linksMineCount
        }
        return 6
    }
    getBuild(room) {
        if (room.emergency) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        }
        let build = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        let capacity = room.energyCapacityAvailable
        switch (true) {
            case (capacity >= 900):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
                break
            case (capacity >= 450):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
                break
            default:
                build = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
                break
        }
        return build
    }
    work(creep) {
        switch (creep.memory.state) {
            case CREEP_DELIVERING:
                if (ServiceCreeps.delivering(creep)) {
                    creep.memory.state = CREEP_MOVE_TO_TARGET
                } else {
                    creep.memory.state = CREEP_IDLE
                }
                creep.memory.destination = ''
                break;
            case CREEP_COLLECTING:
                if (ServiceCreeps.collecting(creep)) {
                    creep.memory.state = CREEP_MOVE_TO_DESTINATION
                } else {
                    creep.memory.state = CREEP_IDLE
                }
                creep.memory.target = ''
                break;
            case CREEP_MOVE_TO_TARGET:
                if (!ServiceCreeps.moveToTarget(creep)) {
                    creep.memory.state = CREEP_COLLECTING
                }
                break;
            case CREEP_MOVE_TO_DESTINATION:
                if (!ServiceCreeps.moveToDestination(creep)) {
                    creep.memory.state = CREEP_DELIVERING
                }
                break;
            default:
                if (creep.carry.energy > 0 && creep.memory.destination) {
                    creep.memory.state = CREEP_MOVE_TO_DESTINATION
                } else if (creep.carry.energy === 0 && creep.memory.target) {
                    creep.memory.state = CREEP_MOVE_TO_TARGET
                }
                break;
        }
    }
    
}

module.exports = new RoleCarrier