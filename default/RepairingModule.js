let RepositoryCreeps = require('RepositoryCreeps')
let RoleRepairer = require('RoleRepairer')
let RepositoryStructures = require('RepositoryStructures')
class RepairingModule {
    constructor(){
    }
    main(roomName){
        let repairers = RepositoryCreeps.getCreepsByRoles(room.name,[RoleRepairer.getName()]).filter(repairer => !repairer.memory.target && !repairer.spawning)
    }
    assignTarget(repairers,roomName){
        let room = Game.rooms[roomName]
        let vulnerableRoads = gameRoom.find(FIND_STRUCTURES).filter(structure => structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax - 1000)
        while(vulnerableRoads && repairers){
            let road = vulnerableRoads.shift()
            let repairer = repairers.shift()
            repairer.memory.target = road.id
        }
        let wallsAndRamparts = gameRoom.find(FIND_STRUCTURES).filter(structure => (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) && structure.hits < structure.hitsMax)
        wallsAndRamparts = _.orderBy(wallsAndRamparts,['hits'],['asc'])
        while(wallsAndRamparts && repairers){
            let structure = wallsAndRamparts.shift()
            let repairer = repairers.shift()
            repairer.memory.target = structure.id
        }
    }
    assignDestination(repairers,roomName){
        let destination = this.findDestination(roomName)
        let droppedResources = []
        if(!destination){
            droppedResources = Game.rooms[roomName].find(FIND_DROPPED_RESOURCES,{filter:droppedResource => droppedResource.energy >= 200})
        }
        while(repairers && (destination || droppedResources)){
            let repairer = repairers.shift()
            if(destination){
                repairer.memory.destination = destination.id
                continue
            }
            repairer.memory.destination = droppedResources[0].id
            if(droppedResources[0].energy - repairer.carryCapacity < 200){
                droppedResources.shift()
            }
        }
    }
    findDestination(roomName){
        let destination = RepositoryStructures.getLink(roomName)
        if(destination){
            return destination
        } 
        destination = RepositoryStructures.getStorage(roomName)
        if(destination){
            return destination
        }
        destination = RepositoryStructures.getContainer(roomName)
        if(destination){
            return destination
        }
    }
}

module.exports = new RepairingModule