let RepositoryCreeps = require('RepositoryCreeps')
class ServiceCreeps{
    calculatePriority(roomName,role){
        let room = Memory.ownedRooms[roomName]
        let creepsMaximum = RepositoryCreeps.getCreepRoleMaximum(room,role)
        let priority = RepositoryCreeps.getCreepsPriority(room,role)
        let creepsCount = RepositoryCreeps.getCreepsCountByRole(room.name,role)
        
        if(creepsCount >= creepsMaximum){return 0}
        if(creepsCount ===0){priority+=2}
        if(creepsCount > creepsMaximum/2){priority -=1}
        return priority
    }
    harvest(creep){
        if(creep.memory.mining){
            creep.harvest(Game.getObjectById(creep.memory.target))
            return
        }
        if(creep.memory.container){
            let container = Game.getObjectById(creep.memory.container)
            if(!creep.pos.isEqualTo(container.pos.x,container.pos.y)){
                creep.moveTo(container)
                return
            }
            creep.memory.mining = true
        }
        let source = Game.getObjectById(creep.memory.target)
        if(creep.harvest(source) === ERR_NOT_IN_RANGE){
                let result = creep.moveTo(source,{visualizePathStyle: {stroke: '#ffaa00'},range:1})
                return
            return
        }
        //creep.say("Mining")
    }

    upgrade(creep){
        let controller = Game.getObjectById(creep.memory.destination)
        if(creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'},range:3})
            //creep.say("Upgrading")
            return true
        }
        return false
    }
    build(creep){
        
        let destination = Game.getObjectById(creep.memory.destination)
        if(creep.carry.energy === 0 || !destination){
            return false
        }
        let result = creep.build(destination)
        if(result === ERR_NOT_IN_RANGE){
            creep.moveTo(destination,{range:3})
            //creep.say('To Build')
        }else if(result === OK){
            //creep.say("Building")
        }else{
            //console.log(result)
            return false
        }
        return true
    }
    deliver(creep){
        let destination = Game.getObjectById(creep.memory.destination)
        if(!destination){
            //console.log('Couldnt get destination.Creep role -> '+creep.memory.role +" and ID -> "+creep.id)
            return false
        }
        let amountNeeded = 0
        if(destination.structureType === STRUCTURE_CONTAINER && destination.store){
            amountNeeded = destination.storeCapacity - destination.store.energy
        }else if(destination.structureType){
            amountNeeded = destination.energyCapacity - destination.energy
        }else{
            amountNeeded = destination.carryCapacity - destination.carry.energy
        }
        let amountToTransfer =  amountNeeded < creep.carry.energy ? amountNeeded:creep.carry.energy
        if(amountNeeded === 0){
            //creep.say("Not needed!")
            return false
        }
        let result = creep.transfer(destination,RESOURCE_ENERGY,amountToTransfer)
        if(result === ERR_NOT_IN_RANGE){
            creep.moveTo(destination,{visualizePathStyle: {stroke: '#ffffff'},range:1})
            //creep.say('To Deliver!')
            return true
        }else if(result === OK){
            //creep.say("Delivering!")
            //we return false just so the controller will look for another destination
            return false
        }
        //console.log('Couldnt deliver. Result ->'+result)
        
        return false
    }
    collect(creep){
        let target = Game.getObjectById(creep.memory.target)
        if(!target){
            //console.log('Unable to select target -> '+ creep.memory.target) 
            //console.log('Crep name is -> '+creep.name)
            return false
        }
        let result = ''
        
        if(target.energy){
            result = creep.pickup(target)
            if(result === -7){
                result = creep.withdraw(target,RESOURCE_ENERGY)
            }
           
        }else{
            if( target.store && target.store.energy < creep.carryCapacity/2){
                console.log('Target has too few resources')
                return false
            }
            result = creep.withdraw(target,RESOURCE_ENERGY)
        }
        if(result === ERR_NOT_IN_RANGE){
            creep.moveTo(target,{range:1})
            //creep.say('To collect!!')
            return true
        }else if(result === OK){
            //creep.say("Collecting!!")
            //we return false for the controller to assign new target
            return false
        }
        //console.log('Couldnt collect error =>'+result)
        return false
    }
    collectt(creep){
        let destination = Game.getObjectById(creep.memory.destination)
        if(destination.structureType){
            creep.withdraw(destination,RESOURCE_ENERGY)
        }else{
            creep.pickup(destination)
        }
    }
    
}
module.exports = new ServiceCreeps