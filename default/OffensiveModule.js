class OffensiveModule {
    wreckerSquad(){
        let wrecker = Object.values(Game.creeps).filter(creep => creep.memory.role === 'Attacker')[0]
        let healer = Object.values(Game.creeps).filter(creep => creep.memory.role === 'Healer')[0]
        //this.wreck(wrecker)
        //this.heal(healer,wrecker)
    }
    wreck(wrecker){
        
        if(!Game.flags['wreck'].room){
            wrecker.moveTo(Game.flags['wreck'])
            return
        }
        let target = wrecker.pos.findClosestByRange(FIND_STRUCTURES,{filter:structure => structure.structureType === STRUCTURE_EXTENSION})//Game.getObjectById('5ad54f0ec0037f40373c6b59')//Game.flags['wreck'].pos.findClosestByRange(FIND_STRUCTURES,{filter:structure => structure.structureType === STRUCTURE_EXTENSION})
        if(target){
            let result = wrecker.dismantle(target)
            if(result === ERR_NOT_IN_RANGE){
                wrecker.moveTo(target)
            }
        }
    }
    heal(healer,wrecker){
       
        if(!healer.pos.isNearTo(wrecker)){
            healer.moveTo(wrecker)
        }
        if(wrecker.hitsMax - wrecker.hits >260){
            healer.heal(wrecker)
        }
        if(healer.hitsMax - healer.hits > 400){
            healer.heal(healer)
        }
        
    }
    healersHeal(healers){
        let damagedHealer = healers.filter(creep => creep.hits < creep.hitsMax)[0]
        if(damagedHealer){
            healers.forEach(healer=> healer.heal(damagedHealer))
        }
        
    }
   
    compare(a,b){
        if (a.ticksToLive === b.ticksToLive){
            return 0
        }else{
            return a.ticksToLive > b.ticksToLive ? 1:-1
        }
    }
    rangedSwarmAttack(){
        let grief = ['Nooooo','Jimmy!!','Why you?','Brother!!!','Save me!','Why....','My love!💔','Dont die!😭','Pls wakeup😭',',I cry!!😭']
        let taunt = ['Java>C#','HR','spaces>tabs','Managers','Apple','Windows8','No Coffee','0/1==null','var i=1/0;','undefined']
        if(!Game.flags.rangedSwarmAttack || !Game.flags.group){
            return
        }
        let rangedDestroyers = Object.values(Game.creeps).filter(creep => creep.memory.role === Memory.creepsConf.roles.rangedDestroyer)
        if(Memory.isAttacking){
            if(rangedDestroyers.length ===-6){
                Memory.isAttacking = false
                Memory.creepsConf.maximum[Memory.creepsConf.roles.rangedDestroyer] = 0
                return false
            }
            let counter = 0
            rangedDestroyers.forEach(creep =>{
                if(creep.pos.roomName === Game.flags.rangedSwarmAttack.pos.roomName){
                    let enemyStructures = creep.room.lookAtArea(LOOK_STRUCTURES,Math.max(0,creep.pos.y-3), Math.max(0,creep.pos.x-3),Math.max(0,creep.pos.y+3), Math.max(0,creep.pos.x+3))
                    if(1 >0){
                        creep.rangedMassAttack()
                    }
                }
                creep.moveTo(Game.flags.rangedSwarmAttack,{reusePath:0,range:0})
                let tombstonePresent = creep.pos.findClosestByRange(FIND_TOMBSTONES,1)
                if(tombstonePresent){
                    creep.say(taunt[counter%10],true)
                }else{
                    //creep.say(taunt[counter%10],true)
                    creep.say('VICTORY!',true)
                }
                counter++
            })
            return
        }
        if(Game.flags.group.room){
            let gatheredCreeps = Game.flags.group
                                        .pos
                                        .findInRange(FIND_MY_CREEPS,10)
                                        .length
            if(gatheredCreeps >= Memory.creepsConf.maximum[Memory.creepsConf.roles.rangedDestroyer]-10 && gatheredCreeps > 10){
                Memory.isAttacking = true
                Memory.creepsConf.maximum[Memory.creepsConf.roles.rangedDestroyer] = 0
                return
            }
        }
        
        let counter = 0
        rangedDestroyers.forEach(creep => {
            let x = Game.flags.group.pos.x + counter % 10
            let y = Game.flags.group.pos.y + Math.floor(counter / 10)
            let roomName = Game.flags.group.pos.roomName
            let moveResult = ERR_INVALID_TARGET
            //creep.rangedMassAttack()
            while(moveResult === ERR_INVALID_TARGET){
                
                moveResult = creep.moveTo(new RoomPosition(x, y,roomName),{reusePath:1})
                counter++
            }
            
        })
    }
}

module.exports = new OffensiveModule