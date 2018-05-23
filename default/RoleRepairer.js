class RoleRepairer {
    constructor(){
        this.name = 'Repairer'
        this.priority = 6
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        if(room.level < 3){
            return 0
        }
        if(room.underAttack && room.threatLevel > 1){
            return 3
        }
        return 1
    }
    getBuild(room){
        if(room.energyCapacityAvailable > 4000){
            return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
        }
        if(room.energyAvailable > 750){
            return [CARRY,CARRY,CARRY,CARRY,CARRY,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE]
        }
        if(room.energyCapacityAvailable > 800){
            return [CARRY,CARRY,CARRY,WORK,WORK,MOVE,MOVE]
        }
        
        return [CARRY,CARRY,CARRY,WORK,MOVE,MOVE]
    }
    main(repairer){
        if(!repairer.memory.target || !repairer.memory.destination){
            return
        }
        let target = Game.getObjectById(repairer.memory.target)
        if(repairer.carry.energy === repairer.carryCapacity){
            repairer.memory.repairing = true
        }
        if(target.hits === target.hitsMax || repairer.carry.energy === 0){
            repairer.memory.target = ''
            repairer.memory.repairing = false
        }
        let operationResult = ''
        if(repairer.memory.repairing){
            operationResult = repairer.repair(target)
        }else{
            let destination = Game.getObjectById(creep.memory.destination)
            if(destination.structureType){
                operationResult = creep.withdraw(destination,RESOURCE_ENERGY)
            }else{
                operationResult = creep.pickup(destination)
            }
        }
        if(operationResult === ERR_NOT_IN_RANGE){
            repairer.moveTo(destination,{range:3})
        }
    }
}

module.exports = new RoleRepairer