const RepositoryCreeps = require('RepositoryCreeps')
const RepositoryStructures = require('RepositoryStructures')
const RoleCarrier = require('RoleCarrier')
const RoleBuilder = require('RoleBuilder')
const RoleMineralMiner = require('RoleMineralMiner')
const ConfigRooms = require('ConfigRooms')

class BuildingModule {
    constructor(){
        
    }
    main(room){
        room = Game.rooms[room.name]
        const cSites = Object.values(Memory.ownedRooms[room.name].constructionSites).map(cSite => Game.getObjectById(cSite.id)).filter(cSite => cSite)
        if(!cSites){
            return
        }
        const creepsWithoutTargetToBuild = RepositoryCreeps.getCreepsByRoles(room.name,[RoleBuilder.getName()]).filter(creep => !creep.memory.destination)
        this.assignConstructionSites(creepsWithoutTargetToBuild, cSites)
    }
    assignConstructionSites(creeps, constructionSites){
        creeps.forEach(creep => {
            const cSite = constructionSites.shift()
            if(cSite){
                creep.memory.destination = cSite.id
            }
        })
    }
}

module.exports = new BuildingModule