//DEPRECATED
class CreepControllerAttacker{
    work(creep){
       return
        if(!Game.flags['drain'].room){
            creep.moveTo(Game.flags['drain'])
            return
        }
        let target = Game.getObjectById('5ad49e7eff17735239bb4063')//Game.flags['drain'].pos.findClosestByRange(FIND_STRUCTURES,{filter:structure => structure.structureType === STRUCTURE_EXTENSION})
        if(target){
            let result = creep.dismantle(target)
            if(result === ERR_NOT_IN_RANGE){
                creep.moveTo(target)
            }
        }
        if(creep.hitsMax - creep.hits > 60){
            creep.heal(creep)
        }
        return
        let rampart = Game.getObjectById('5acd784a3e3b7013d0a7ad2c')
        let result = creep.dismantle(rampart)
        if(result === ERR_NOT_IN_RANGE){
            creep.moveTo(rampart)
        }
        return
        let taunt = ['Java>C#','HR','spaces>tabs','Managers','Apple','Windows8','No Coffee','0/1==null','var i=1/0;','undefined']
        //creep.say(taunt[Game.time % 10],true)
        let hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS,2)
        creep.attack(hostiles[0])
        
        if(creep.hits < creep.hitsMax){
            creep.heal(creep)
        }
        if(hostiles){
            let outcome = creep.attack(hostiles[0])
            //console.log(outcome)
            if(outcome === ERR_NOT_IN_RANGE && creep.hits > 600){
                creep.moveTo(hostiles[0])
                return
            }
            
        }
        creep.rangedMassAttack()
        if(creep.hits === creep.hitsMax){
            if(creep.pos.isNearTo(Game.flags['drain'])){
                creep.memory.isDraining = true
                
            }
            creep.moveTo(Game.flags['drain'],{range:0})
            creep.memory.isDraining = true
            return
        }
        if(creep.hits < 600 && creep.memory.isDraining){
            creep.memory.isDraining = false
            creep.moveTo(Game.flags['retreat'])
            return
        }
        if(!creep.memory.isDraining){
            creep.moveTo(Game.flags['retreat'])
            return
        }
        if(creep.pos.isNearTo(Game.flags['drain'])){
            creep.memory.isDraining = true
            return
        }
        //creep.moveTo(Game.flags['drain'])
        
        
    }
}

module.exports = new CreepControllerAttacker