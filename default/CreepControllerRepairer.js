let ConfigRooms = require('ConfigRooms')
let RepositoryEnergySources = require('RepositoryEnergySources')
let RepositorySpawns = require('RepositorySpawns')
let ServiceCreeps = require('ServiceCreeps')
class CreepControllerRepairer {
    constructor(){
        
    }
    work(creep){
        
         if(creep.carry.energy === 0){
            let status = ServiceCreeps.collect(creep)
            if(status){
                return true
            }
            creep.memory.destination = ''
            creep.say('Waiting')
            this._findAndAssignTarget(creep)
            return false
        }
        if(creep.memory.isRepairing && Game.getObjectById(creep.memory.destination)){
            let target = Game.getObjectById(creep.memory.destination)
            if((( target && target.structureType === STRUCTURE_WALL || target.structureType === STRUCTURE_RAMPART) && target.hits >= 1000000) || target.hits >= target.hitsMax){
                //console.log(`Target is ${target} and it has ${target.hits}`)
                creep.memory.destination = ''
                creep.memory.isRepairing = false
                this.work(creep)
                return
            }
            
            let result = creep.repair(target)
            if(result === OK){
                creep.say('Repairing')
                return
            }
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target,{range:3})
                creep.say('To repair')
                return
            }
            
            
            
        }
        let endangeredWall = creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_WALL && structure.hits < 400000
        })
        
        if(endangeredWall){
            creep.memory.isRepairing = true
            creep.memory.destination = endangeredWall.id
            
            return 
        }
        let endangeredRampart = creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_RAMPART && structure.hits < 400000
        })
        
        if(endangeredRampart){
            creep.memory.isRepairing = true
            creep.memory.destination = endangeredRampart.id
            
            return 
        }
        let endangeredContainer = creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.hits < 170000
        })
        
        if(endangeredContainer){
            creep.memory.isRepairing = true
            creep.memory.destination = endangeredContainer.id
            return 
        }
        let endangeredRoad = creep.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_ROAD && structure.hits < 4000
        })
        
        if(endangeredRoad){
            creep.memory.isRepairing = true
            creep.memory.destination = endangeredRoad.id
            return 
        }
        let closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: (structure) => {
                    if(structure.structureType === STRUCTURE_ROAD){
                        return false
                    }
                    if(structure.structureType === STRUCTURE_CONTAINER){
                        return false
                    }
                    if(structure.structureType === STRUCTURE_WALL 
                    || structure.structureType === STRUCTURE_RAMPART){
                        return structure.hits < 1000000
                    }
                    return structure.hits < structure.hitsMax
                }
            })//.sort((a,b)=>{a.hits < b.hits ? 1:-1})[0]
        if(closestDamagedStructure) {
            creep.memory.isRepairing = true
            creep.memory.destination = closestDamagedStructure.id
            return
        }
        let controller = Game.getObjectById(creep.memory.destination)
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'},range:3})
            creep.say("Upgrading")
            return true
        }
    }
    _findAndAssignTarget(creep){
        let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter:droppedResource => droppedResource.energy >= 500})
        if(droppedResource){
            creep.memory.target = droppedResource.id
            return true
        }
        let target = RepositoryEnergySources.getLink(creep)
        if(target){
            creep.memory.target = target.id
            return true
        }
        target = RepositoryEnergySources.getStorage(creep)
        if(target){
            creep.memory.target = target.id
            return true
        }
        target = RepositoryEnergySources.getContainer(creep)
        if(target){
            creep.memory.target = target.id
            return true
        }
        
        return false
    }
}
module.exports = new CreepControllerRepairer