const ServiceCreeps = require('ServiceCreeps')
class RoleFiller {
    constructor() {
        this.name = 'Filler'
        this.priority = 11
        this.prespawn = 20
    }
    getPriority(room) {
        if (room.emergency || Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name).length === 0) {
            return 100
        }
        return this.priority
    }
    getName() {
        return this.name
    }
    getPrespawn() {
        return this.prespawn
    }
    getMaximum(room) {
        if (!Game.rooms[room.name].storage) {
            return 0
        }
        if (room.underAttack && room.threatLevel > 1) {
            return 3
        }
        return 2
    }
    getBuild(room) {
        let build = []
        if (room.emergency || Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name && creep.memory.role !== 'Defender').length === 0) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        }
        if (room.emergency || Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name).length === 0) {
            return [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        }
        switch (true) {
            case (room.energyCapacityAvailable > 2000):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 1000):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
                break
            default:
                build = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
                break
        }

        return build
    }
    work(creep) {
        console.log(creep.memory.state)
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
                }else{
                    
                }
                break;
        }
    }
}

module.exports = new RoleFiller