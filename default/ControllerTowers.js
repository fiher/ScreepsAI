class ControllerTowers {
    constructor(){
        
        this.assignedCreepToStorage = false
    }
    work(tower){
        if(!tower){
            return
        }
        function compare(a,b){
            let healPartsA = a.getActiveBodyparts(HEAL)
            let healPartsB = b.getActiveBodyparts(HEAL)
           return healPartsA > healPartsB ? -1:1
        }
        let damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS,{filter:creep=> creep.hits < creep.hitsMax})
        if(damagedCreep){
            tower.heal(damagedCreep)
            return
        }
        let hostiles = tower.pos.findInRange(FIND_HOSTILE_CREEPS,20).filter(creep => creep.getActiveBodyparts(ATTACK) 
                                                        || creep.getActiveBodyparts(RANGED_ATTACK) 
                                                        || creep.getActiveBodyparts(WORK)
                                                        || creep.getActiveBodyparts(MOVE))//.sort(compare)
        if(hostiles.length>0) {
            tower.attack(hostiles[0])
            return
        }
        if(tower.energy < tower.energyCapacity *0.1 ){
            return
        }
        
       
        let closestDamagedContainer = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if(structure.structureType === STRUCTURE_CONTAINER){
                        return structure.hits <100000
                    }
                    return false
                }
            })
        if(closestDamagedContainer){
            tower.repair(closestDamagedContainer)
            return
        }
        let endangeredRampart = tower.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_RAMPART && structure.hits < 3000
        })
        if(endangeredRampart){
            tower.repair(endangeredRampart)
            return 
        }
        let endangeredRoad = tower.pos.findClosestByRange(FIND_STRUCTURES,{
            filter: structure => structure.structureType === STRUCTURE_ROAD && structure.hits < 3000
        })
        if(endangeredRoad){
            tower.repair(endangeredRoad)
            return 
        }
        return
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    if(structure.structureType === STRUCTURE_RAMPART){
                        return structure.hits <20000
                    }
                    if(structure.structureType === STRUCTURE_WALL){
                        return structure.hits < 40000
                    }
                    return structure.hits < structure.hitsMax
                    return false
                }
            })
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
            
    }
}
module.exports = new ControllerTowers