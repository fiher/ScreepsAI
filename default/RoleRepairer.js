let ServiceCreeps = require('ServiceCreeps')

class RoleRepairer {
    constructor() {
        this.name = 'Repairer'
        this.priority = 6
        this.prespawn = 50
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
        const storage = Game.rooms[room.name].storage
        if(storage && storage.store.energy < CRITICAL_STORAGE_ENERGY){
            return 0
        }else if(storage && storage.store.energy < LOW_STORAGE_ENERGY){
            return 1
        }
        if (room.level < 3) {
            return 0
        }
        if (room.underAttack && room.threatLevel > 1) {
            return 3
        }
        
        return 2
    }
    getBuild(room) {
        if (Game.rooms[room.name].storage && Game.rooms[room.name].storage.store.energy < 30000) {
            return [CARRY, CARRY, WORK, WORK, MOVE, MOVE]
        }
        if (room.energyCapacityAvailable > 4000) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK,  MOVE, MOVE, MOVE, MOVE]
        }
        if (room.energyCapacityAvailable > 750) {
            return [CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
        }
        if (room.energyCapacityAvailable > 800) {
            return [CARRY, CARRY, CARRY, WORK, WORK, MOVE, MOVE]
        }

        return [CARRY, CARRY, CARRY, WORK, MOVE, MOVE]
    }
    work(repairer) {
        if (!repairer.memory.target || !repairer.memory.destination) {
            return false
        }
        let target = Game.getObjectById(repairer.memory.target)
        if (repairer.carry.energy === repairer.carryCapacity) {
            repairer.memory.repairing = true
        }
        if (target && target.hits === target.hitsMax) {
            repairer.memory.target = ''
            repairer.memory.repairing = false
            return false
        }
        if (repairer.carry.energy === 0 && repairer.memory.repairing) {
            repairer.memory.target = ''
            repairer.memory.repairing = false
            return false
        }
        let operationResult = ''
        let destination = ''
        if (repairer.memory.repairing) {
            operationResult = repairer.repair(target)
        } else {
            //Even though the name is `destination` the variable is called `target`
            //so that if the repairer is not at its target I can call `repairer.moveTo` for both
            //target and destination
            //TODO FIX THIS SHIT BECAUSE WHEN NEXT TO TARGET I MOVE RANGE 3, NOT RANGE 1
            target = Game.getObjectById(repairer.memory.destination)
            if (target && target.structureType) {
                operationResult = repairer.withdraw(target, RESOURCE_ENERGY)
            } else {
                operationResult = repairer.pickup(target)
            }
        }
        if (operationResult === ERR_NOT_IN_RANGE) {
            repairer.moveTo(target, {
                range: 1
            })
            return
        } else if (operationResult !== OK) {
            repairer.memory.destination = ''
        }
    }
    state(repairer) {
        let states = {
            "repairing": ServiceCreeps.repair,
            "moveToTarget": ServiceCreeps.moveToTarget,
            "moveToDestination": ServiceCreeps.moveToDestination,
            "collecting": ServiceCreeps.collect
        }
        let stateFunction = states[repairer.memory.state]
        if (!stateFunction) {
            stateFunction = states['moveToDestination']
        }
        stateFunction(repairer)
    }
    repair(repairer) {
        if (repairer.repair(Game.getObjectById(repairer.memory.target)) === ERR_NOT_ENOUGH_RESOURCES) {
            repairer.memory.state = 'moveToDestination'
        }
    }
    moveToTarget(repairer) {
        let target = Game.getObjectById(repairer.memory.target)
        if (repairer.repair(target) === ERR_NOT_IN_RANGE) {
            repairer.moveTo(target, {
                range: 3
            })
            return
        }
        repairer.memory.state = 'repair'
    }
    moveToDestination(repairer) {
        let destination = Game.getObjectById(repairer.memory.destination)
        if (!repairer.pos.isNearTo(destination)) {
            repairer.moveTo(destination)
            return
        }
        repairer.memory.state = 'collect'
    }
    collect(repairer) {
        destination = Game.getObjectById(repairer.memory.destination)
        if (destination.structureType) {
            repairer.withdraw(destination, RESOURCE_ENERGY)
            return
        } else {
            operationResult = repairer.pickup(destination)
        }
        if (repairer.carry.energy === repairer.carryCapacity) {
            repairer.memory.state = 'moveToTarget'
            return
        }
    }
}

module.exports = new RoleRepairer