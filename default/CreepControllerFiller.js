let ConfigRooms = require('ConfigRooms')
let RepositoryStructures = require('RepositoryStructures')
let ServiceCreeps = require('ServiceCreeps')
let RepositoryCreeps = require('RepositoryCreeps')
const RoleFiller = require('RoleFiller')
class CreepControllerFiller {
    constructor(){
        
    }
    work(room){
        if(typeof room === 'string'){
            room = Game.rooms[room]
        }
        let creeps = Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name && creep.memory.role === RoleFiller.getName())
        creeps.map(creep => {
            
            let status = false
            if(creep.carry.energy === creep.carryCapacity){
                creep.memory.collecting = false
            }else if(creep.carry.energy === 0){
                creep.memory.collecting = true
                this._findAndAssignTarget(creep)
            }
            if(creep.memory.collecting){
                status = ServiceCreeps.collect(creep)
                if(status){
                    return true
                }
                creep.memory.target = ''
                creep.say('Waiting')
                this._findAndAssignTarget(creep)
                return creep
            }else{
                
                status = ServiceCreeps.deliver(creep)
                if(status){
                    return creep
                }
                creep.memory.destination = ''
                creep.memory.target = ''
                creep.say('Waiting')
                this._findAndAssignTarget(creep)
                this._findAndAssignDestination(creep)
                return creep
            }   
        })
    }
    _findAndAssignTarget(creep){
        let target = RepositoryStructures.getLink(creep.memory.owner)
        if(target && target.energy > MINIMUM_WITHDRAW_ENERGY){
            
            creep.memory.target = target.id
            return true
        }
        target = RepositoryStructures.getStorage(creep.memory.owner)
        if(target && target.store.energy > MINIMUM_WITHDRAW_ENERGY){
            creep.memory.target = target.id
            return true
        }
        target = RepositoryStructures.getContainer(creep)
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
        let availableExtentions = Object.values(Game.rooms[creep.memory.owner].extensions)
                                    .filter(structure =>  structure && structure.energy < structure.energyCapacity).sort(this.compare.bind(creep))
        if(availableExtentions.length === 1){
            creep.memory.destination = availableExtentions[0].id
            return true
        }else if(availableExtentions.length > 1){
            creep.memory.destination = availableExtentions
                .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next).id
            return true
            
        }
        let availableSpawns = Object.values(Game.rooms[creep.memory.owner].spawns)
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
        let availableTowers = Object.values(Game.rooms[creep.memory.owner].towers)
                                    .filter(structure => structure && structure.energy < structure.energyCapacity*0.6)
        if(availableTowers.length === 1){
            creep.memory.destination = availableTowers[0].id
            return
        }else if(availableTowers.length > 1){
            creep.memory.destination = availableTowers
                .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next).id
            return true
        }
        let availableStorage = Game.rooms[creep.memory.owner].storage
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