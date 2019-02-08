let ServiceCreeps = require('ServiceCreeps')
let RepositoryStructures = require('RepositoryStructures')
let ConfigRooms = require('ConfigRooms')
class CreepControllerUpgrader {
    work(creep) {
        if (!creep.memory.target) {
            this._findAndAssignTarget(creep)
        } else if (!creep.memory.destination) {
            this._findAndAssignDestination(creep)
        }

        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false
            creep.memory.target = ''
            this._findAndAssignTarget(creep)
        } else if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true
        }

        if (creep.memory.upgrading) {
            ServiceCreeps.upgrade(creep)
        } else {
            let status = ServiceCreeps.collect(creep)
            if (!status) {
                creep.memory.target = ''
                this._findAndAssignTarget(creep)
                ServiceCreeps.collect(creep)
            }
            ServiceCreeps.upgrade(creep)
        }

    }
    _findAndAssignTarget(creep) {
        let target = RepositoryStructures.getStorage(creep.memory.owner)
        if (target) {
            creep.memory.target = target.id
            return true
        }
        target = RepositoryStructures.getContainer(creep)
        if (target) {
            creep.memory.target = target.id
            return true
        }

        let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: droppedResource => droppedResource.energy >= 100
        })
        if (droppedResource) {
            creep.memory.target = droppedResource.id
            return true
        }
        return false
    }
    _findAndAssignDestination(creep) {
        let controller = Game.rooms[creep.memory.owner].controller
        if (controller) {
            creep.memory.destination = controller.id
            return true
        }
        return false
    }
}

module.exports = new CreepControllerUpgrader