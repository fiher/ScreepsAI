const BuildingModule = require('BuildingModule')
const ControllerSpawns = require('ControllerSpawns')
const ControllerLinks = require('ControllerLinks')
const ControllerTower = require('ControllerTower')
const ControllerTerminal = require('ControllerTerminal')
const ConfigRooms = require('ConfigRooms')
const ConfigMarket = require('ConfigMarket')
const CollectingModule = require('CollectingModule')
const CreepControllerFiller = require('CreepControllerFiller')
const DefenseModule = require('DefenseModule')
const RepositoryCreeps = require('RepositoryCreeps')
const RepairingModule = require('RepairingModule')
const RemoteModule = require('RemoteModule')
const MiningModule = require('MiningModule')
const ServiceRooms = require('ServiceRooms')

class ControllerRooms {
    main(){
        ConfigRooms.init()
        ConfigMarket.init()
        Object.values(Memory.ownedRooms).filter(room => Game.rooms[room.name]).forEach(room => this.manage(room))
    }
    manage(room) {
        const gameRoom = Game.rooms[room.name]
        room = Memory.ownedRooms[room.name]
        this.creepManagement(room)
        this.spawningCreeps(room)
        CreepControllerFiller.work(gameRoom)
        ServiceRooms.isEmergency(room)
        ControllerTower.main(gameRoom)
        ControllerTerminal.main(room)
        ControllerLinks.main(room.name)
        if (!!Game.rooms[room.name].links && Game.time % 20 === 0) {
            ControllerLinks.main(room.name)
        }
        DefenseModule.defend()
        if (room.underAttack) {
            DefenseModule.main(room)
        }
    }
    
    creepManagement(room){
        if (Game.time % 2 === 0) {
            MiningModule.main(room)
            MiningModule.mineralMining(room)
            RepairingModule.main(room)
            RemoteModule.main(room)
            CollectingModule.main(room)
            BuildingModule.main(room)
        }
    }
    spawningCreeps(room){
        if(Game.time % 9 === 0) {
            const spawns = Game.rooms[room.name].spawns
                .filter(spawn => spawn && !spawn.spawning)
            if (spawns.length > 0) {
                ControllerSpawns.manage(spawns[0])
            }

        } else if (Game.time % 11 === 0) {
            // TODO: REMOVE FROM HERE
            DefenseModule.main(room)
        }
    }
}
module.exports = new ControllerRooms