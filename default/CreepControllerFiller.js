let ConfigRooms = require('ConfigRooms')
let RepositoryEnergySources = require('RepositoryEnergySources')
let RepositoryStructures = require('RepositoryStructures')
let ServiceCreeps = require('ServiceCreeps')
let RepositoryCreeps = require('RepositoryCreeps')
class CreepControllerFiller {
    constructor(){
        
    }
    work(room){
        if(typeof room === 'string'){
            room = Game.rooms[room]
        }
        let creeps = Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name && creep.memory.role === Memory.creepsConf.roles.filler)
        creeps.forEach(creep => {
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
                creep.say('Waiting')
                this._findAndAssignTarget(creep)
                return false
            }else{
                
                status = ServiceCreeps.deliver(creep)
                if(status){
                    return true
                }
                creep.memory.destination = ''
                creep.memory.target = ''
                creep.say('Waiting')
                this._findAndAssignDestination(creep)
                return false
        }   
        })
    }
    _findAndAssignTarget(creep){
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
        
        let droppedResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,{filter:droppedResource => droppedResource.energy >= 200})
        if(droppedResource){
            creep.memory.target = droppedResource.id
            return true
        }
        return false
    }
    _findAndAssignDestination(creep){
        let creepCarry = creep.carry.energy
        let availableExtentions = Object.values(Memory.ownedRooms[creep.memory.owner].extensions)
                                    .map(extention => Game.getObjectById(extention.id))
                                    .filter(structure =>  structure && structure.energy < structure.energyCapacity).sort(this.compare.bind(creep))
        if(availableExtentions.length === 1){
            creep.memory.destination = availableExtentions[0].id
            return true
        }else if(availableExtentions.length > 1){
            creep.memory.destination = availableExtentions
                .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next).id
            return true
            
        }
        let availableSpawns = Object.values(Memory.rooms[creep.room.name].spawns)
                                .map(spawnId => Game.getObjectById(spawnId))
                                .filter(spawn => spawn.energy < spawn.energyCapacity)
        if(availableSpawns.length === 1){
            creep.memory.destination = availableSpawns[0].id
            return true
        }else if(availableSpawns.length > 1){
            creep.memory.destination =  availableSpawns
                .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next).id
            console.log("fock")
            return true
        }
        let availableTowers = Object.values(Memory.rooms[creep.room.name].towers)
                                    .map(tower => Game.getObjectById(tower.id))
                                    .filter(structure => structure && structure.energy < structure.energyCapacity*0.6)
        if(availableTowers.length === 1){
            creep.memory.destination = availableTowers[0].id
            return
        }else if(availableTowers.length > 1){
            creep.memory.destination = availableTowers
                .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next).id
            return true
        }
        let availableStorage = creep.room.find(FIND_STRUCTURES,{filter:structure => structure.structureType === STRUCTURE_STORAGE})[0]
        if( !availableStorage || creep.memory.target === availableStorage.id){
            return false
        }
        creep.memory.destination = availableStorage.id
    }
    compare(a,b){
        return this.pos.findPathTo(a) < this.pos.findPathTo(b) ? 1:-1
    }
}

module.exports = new CreepControllerFiller