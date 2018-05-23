let RepositoryEnergySources = require('RepositoryEnergySources')
class CreepControllerMineralFiller{
    constructor(){
        
    }
    work(creep){
        if(_.sum(creep.carry) === creep.carryCapacity){
            creep.memory.collecting = false
        }else if(_.sum(creep.carry) === 0){
            creep.memory.collecting = true
            this.findAndAssignTarget(creep)
        }
        
        if(creep.memory.collecting && !creep.memory.target){
            this.findAndAssignTarget(creep)
        }else if(!creep.memory.collecting && !creep.memory.destination){
            this.findAndAssignDestination(creep)
        }
        
        if(creep.memory.collecting){
            let target = Game.getObjectById(creep.memory.target)
            if(!target || !target.store){
                return
            }
            
                
            let keys = Object.keys(target.store)
            let outcome = creep.withdraw(target, keys[keys.length-1])
            if(outcome === ERR_NOT_IN_RANGE){
                creep.moveTo(target,{range:1})
                return
            }
            if(outcome !== OK){
                this.findAndAssignTarget(creep)
                return
            }
            return
        }
        let destination = Game.getObjectById(creep.memory.destination)
        let keys = Object.keys(creep.carry)
        let outcome = creep.transfer(destination,keys[keys.length-1])
        if(outcome === ERR_NOT_IN_RANGE){
            creep.moveTo(destination,{range:1})
            return
        }
        if(outcome !== OK){
            this.findAndAssignTarget(creep)
            return
        }
        return
    }
    findAndAssignTarget(creep){
        let container = Object.values(Memory.ownedRooms[creep.memory.owner].minerals)[0].container
        if(container){
            creep.memory.target = container
            return
        }
        //let target = RepositoryEnergySources.getStorage(creep)
        //if(target){
        //    creep.memory.target = target.id
        //    return true
        //}
        let target = RepositoryEnergySources.getContainer(creep)
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
    findAndAssignDestination(creep){
        let terminal = Game.rooms[creep.memory.owner].terminal
        
        if(terminal && _.sum(terminal.store) < terminal.storeCapacity){
            creep.memory.destination = terminal.id
            return true
        }
        let storage = creep.room.storage
        if(storage){
            creep.memory.destination = storage.id
        }
        
    }
}

module.exports = new CreepControllerMineralFiller