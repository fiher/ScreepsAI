let ControllerSpawns = require('ControllerSpawns')
let CreepControllerFiller = require('CreepControllerFiller')
let ControllerLinks = require('ControllerLinks')
let RepositoryCreeps = require('RepositoryCreeps')
let MiningModule = require('MiningModule')
let DefenseModule = require('DefenseModule')

class ControllerRooms{
    manage(room){
        room = Memory.ownedRooms[room.name]
        MiningModule.main(room)
        CreepControllerFiller.work(room.name)
        if(room.links && !_.isEmpty(room.links) && Game.time % 2 === 0){
            ControllerLinks.main(room.name)
        }
        if(room.underAttack){
            DefenseModule.main(room)
        }
        if(Game.time % 9 === 0){
            
            let spawns = Object.keys(room.spawns)
                        .map(spawn => Game.getObjectById(spawn))
                        .filter(spawn => spawn && !spawn.spawning)
            console.log(spawns)
            if(spawns.length > 0 ){
                ControllerSpawns.manage(spawns[0])
            }
            
        }else if(Game.time % 11 === 0){
            DefenseModule.main(room)
        }
    }

}
module.exports = new ControllerRooms