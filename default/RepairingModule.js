let RepositoryCreeps = require('RepositoryCreeps')
let RoleRepairer = require('RoleRepairer')
let RepositoryStructures = require('RepositoryStructures')
let sortingFunction = require('sortingFunction')
class RepairingModule {
    constructor() {}
    main(room) {
        let repairersWithoutTarget = RepositoryCreeps.getCreepsByRoles(room.name, [RoleRepairer.getName()]).filter(repairer => !repairer.memory.target && !repairer.spawning)
        this.assignTarget(repairersWithoutTarget, room.name)
        let repairersWithoutDestination = RepositoryCreeps.getCreepsByRoles(room.name, [RoleRepairer.getName()]).filter(repairer => !repairer.memory.destination && !repairer.spawning)
        this.assignDestination(repairersWithoutDestination, room.name)
    }
    assignTarget(repairers, roomName) {
        let room = Game.rooms[roomName]
        if (!room) {
            return
        }
        let vulnerableStructures = room.find(FIND_STRUCTURES).filter(structure => (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax - 1000) || (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax - 30000) || (structure.structureType !== STRUCTURE_ROAD && structure.structureType !== STRUCTURE_CONTAINER && structure.structureType !== STRUCTURE_WALL && structure.structureType !== STRUCTURE_RAMPART && structure.hits < structure.hitsMax))
        while (vulnerableStructures.length > 0 && repairers.length > 0) {
            let structure = vulnerableStructures.shift()
            let repairer = repairers.shift()
            repairer.memory.target = structure.id
        }
        let wallsAndRamparts = room.find(FIND_STRUCTURES).filter(structure => (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) && structure.hits < structure.hitsMax)

        wallsAndRamparts = wallsAndRamparts.sort(this.sort)
        //console.log(JSON.stringify(wallsAndRamparts))
        while (wallsAndRamparts.length > 0 && repairers.length > 0) {
            let structure = wallsAndRamparts.shift()
            let repairer = repairers.shift()
            repairer.memory.target = structure.id
        }
    }
    sort(structureA, structureB) {
        return structureA.hits > structureB.hits ? 1 : -1
    }
    assignDestination(repairers, roomName) {
        let destination = this._findDestination(roomName)
        let droppedResources = []
        if (!destination) {
            droppedResources = Game.rooms[roomName].find(FIND_DROPPED_RESOURCES, {
                filter: droppedResource => droppedResource.energy >= 200
            })
        }
        while (repairers.length > 0 && (destination || droppedResources.length > 0)) {
            let repairer = repairers.shift()
            if (destination) {
                repairer.memory.destination = destination.id
                continue
            }
            repairer.memory.destination = droppedResources[0].id
            if (droppedResources[0].energy - repairer.carryCapacity < 200) {
                droppedResources.shift()
            }
        }
    }
    _findDestination(roomName) {
        let destination = RepositoryStructures.getLink(roomName)
        if (destination) {
            return destination
        }
        destination = RepositoryStructures.getStorage(roomName)
        if (destination) {
            return destination
        }
        destination = RepositoryStructures.getContainers(roomName)[0]
        if (destination) {
            return destination
        }
    }
}

module.exports = new RepairingModule