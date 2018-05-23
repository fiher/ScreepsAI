let ConfigRooms = require('ConfigRooms')
let RepositoryEnergySources = require('RepositoryEnergySources')
let RepositoryStructures = require('RepositoryStructures')
let ServiceCreeps = require('ServiceCreeps')
let RepositoryCreeps = require('RepositoryCreeps')
class CreepControllerCarrier {
    work(creep){
        if(creep.ticksToLive < 50 && creep.carry.energy === 0){
            creep.suicide()
            return
        }
        let status = false
        if(creep.carry.energy === creep.carryCapacity){
            creep.memory.collecting = false
        }else if(creep.carry.energy === 0){
            creep.memory.collecting = true
        }
        if(creep.memory.collecting){
            status = ServiceCreeps.collect(creep)
            if(status){
                return true
            }
            creep.memory.target = ''
            this._findAndAssignTarget(creep)
            return false
        }else{
            status = ServiceCreeps.deliver(creep)
            if(status){
                return true
            }
            creep.memory.destination = ''
            creep.say('Waiting')
            this._findAndAssignDestination(creep)
            return false
        }
    }
    _findAndAssignTarget(creep){
        let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter:droppedResource => droppedResource.energy >= 100})
        if(droppedResource){
            creep.memory.target = droppedResource.id
            return true
        }
        let target = RepositoryEnergySources.getContainerMine(creep)
        if(target){
            creep.memory.target = target.id
            return true
        }
        return false
    }
    _findAndAssignDestination(creep){
        let storage = RepositoryEnergySources.getStorage(creep)
        if(storage){
            creep.memory.destination = storage.id
            return true
        }
        let structure = RepositoryStructures.getClosestStructureWithEnergy(creep,creep.memory.owner)
        if(structure){
            creep.memory.destination = structure.id
            return true
        }
        let creepWithoutResources = RepositoryCreeps.getClosestCreepWithoutResources(creep)
        if(creepWithoutResources){
            creep.memory.destination = creepWithoutResources.id
            return true
        }
        return false
    }
}

module.exports = new CreepControllerCarrier