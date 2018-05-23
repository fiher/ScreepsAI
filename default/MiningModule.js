let RepositoryCreeps = require('RepositoryCreeps')
let RoleMiner = require('RoleMiner')
let ConfigRooms = require('ConfigRooms')
class MiningModule {
    constructor(){
        
    }
    main(room){
        room = Memory.ownedRooms[room.name]
        if(!room.sources){ return false}
        let sources = Object.values(room.sources).filter(source => source.maxCreepsCount > source.creeps.length && source.energy > source.creepsMiningPotential)
        let miners = RepositoryCreeps.getCreepsByRoles(room.name,[RoleMiner.getName()]).filter(miner => !miner.memory.target && !miner.spawning)
        
        if(!sources.length || !miners.length){
            return false
        }
        while(miners.length > 0 && sources.length > 0){
            let miner = miners.shift()
            let source = sources[0]
            if(source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential){
                sources.shift()
                source = sources[0]
            }
            this.assignMiner(miner, sources[0])
            
            if(source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential){
                sources.shift()
            }
        }
    }
    assignMiner(miner,source){
        if(!source){ return }
        if(!source.container){
            let container = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES,1,{filter:structure => structure.structureType === STRUCTURE_CONTAINER})[0]
            source.container = container ? container.id : false
        }
        if(!source.link){
            let link = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES,2,{filter:structure => structure.structureType === STRUCTURE_LINK})[0]
            source.link = link ? link.id : false
        }
        ConfigRooms.assignMinerToEnergySource(miner, miner.memory.owner, source.id)
        
    }
}

module.exports = new MiningModule