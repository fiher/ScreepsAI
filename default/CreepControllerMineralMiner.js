let ServiceCreeps = require('ServiceCreeps')
class CreepControllerMineralMiner {
    constructor(){
        
    }
    work(creep){
        if(creep.memory.target){
            ServiceCreeps.harvest(creep)
            return
        }
        let target = Game.getObjectById(Object.keys(Memory.ownedRooms[creep.memory.owner].minerals)[0])
        creep.memory.target = target.id
        if(Memory.ownedRooms[creep.memory.owner].minerals[target.id].container){
            creep.memory.container = Memory.ownedRooms[creep.memory.owner].minerals[target.id].container
            return
        }
        let container = target.pos.findInRange(FIND_STRUCTURES,1,{filter:structure => structure.structureType === STRUCTURE_CONTAINER})[0]
        if(container){
            Memory.ownedRooms[creep.memory.owner].minerals[target.id].container = container.id
            creep.memory.container = container.id
            return
        }
    }
}

module.exports = new CreepControllerMineralMiner