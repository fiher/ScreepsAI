let RepositoryEnergySources = require('RepositoryEnergySources')
class RoleMiner {
    constructor(){
        this.name = 'Miner'
        this.priority = 11
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    work(creep){
        if(creep.memory.link && creep.carryCapacity > 0 && creep.carry.energy > creep.carryCapacity-20){
            let link = Game.getObjectById(creep.memory.link)
            creep.transfer(link,RESOURCE_ENERGY)
        }
        let source = Game.getObjectById(creep.memory.source)
        let outcome = creep.harvest(source)
        if(outcome === OK){
            return
        }
        if(outcome === ERR_NOT_IN_RANGE){
            let container = Game.getObjectById(creep.memory.container)
            if(container){
                creep.moveTo(container)
                return
            }
            creep.moveTo(source,{range:1})
            return
        }
    }
    getMaximum(room){
        room = Memory.ownedRooms[room.name]
        let sources = Object.values(room.sources)
        
        
        let build = this.getBuild(room)
        if(!build){
            return 0
        }
        let buildWorkParts = build.filter(part => part === WORK).length
        let workPartsNeeded = (sources.length * SOURCE_ENERGY_CAPACITY) / (HARVEST_POWER * ENERGY_REGEN_TIME)
        let maximumMiners = 0
        sources.forEach(source => maximumMiners += source.maxCreepsCount)
        let minersNeeded = Math.ceil(workPartsNeeded/buildWorkParts)
        
        return minersNeeded > maximumMiners ? maximumMiners : minersNeeded
    }
    getBuild(room){
        if(room.emergency || Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name).length ===0){
            return [WORK,WORK,MOVE,MOVE]
        }
        let build = []
        let capacity = room.energyCapacityAvailable
        
        switch(true){
            case (400 < capacity && capacity < 600):
                build = [WORK,WORK,WORK,MOVE,MOVE]
                break;
            case (600 <= capacity && capacity < 750):
                build = [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE]
                break;
            case (650 <= capacity && RepositoryEnergySources.getLinksMineCount(room.name) > 0):
                build = [CARRY,CARRY,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE]
                break;
            case (650 <= capacity && !RepositoryEnergySources.getLinksMineCount(room.name)):
                build = [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE]
                break;
            default:
                build = [WORK,WORK,MOVE,MOVE]
                break;
        }
        return build
    }
}

module.exports = new RoleMiner