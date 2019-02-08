require('RoomCache')

class RepositoryStructures {
    getClosestStructureWithEnergy(creep) {
        let creepCarry = creep.carry.energy
        let structures = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_STORAGE, STRUCTURE_CONTAINER]
        while (structures.length > 0) {
            let structure = structures.shift()
            if (_.isEmpty(Game.rooms[creep.memory.owner][structure + 's']) && _.isEmpty(Game.rooms[creep.memory.owner][structure])) {
                continue
            }
            if (structure === STRUCTURE_STORAGE && Game.rooms[creep.memory.owner][structure]) {
                return Game.rooms[creep.memory.owner][structure]
            }
            let availableStructures = Game.rooms[creep.memory.owner][structure] ? Game.rooms[creep.memory.owner][structure] : Game.rooms[creep.memory.owner][structure + 's']
            availableStructures = availableStructures
                .filter(structure => structure && structure !== undefined && (structure.energy < structure.energyCapacity || (structure.store && structure.storeCapacity - structure.store.energy >= creep.carry.energy / 5)))
            if (availableStructures.length === 1) {

                return availableStructures[0]
            } else if (availableStructures.length > 1) {
                return availableStructures
                    .reduce((prev, next) => creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev : next)
            }
        }
        creep.say('Bug!!')
        return false
    }
    
    getLinksMine(roomName) {
        return Object.values(Memory.ownedRooms[roomName].sources)
            .map(source => Game.getObjectById(source.link))
    }
    
    getLinks(roomName) {
        return Game.rooms[roomName].links
            .filter(link => link.energy > 0 &&
                !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))
    }
    
    getLinksAll(roomName) {
        return Game.rooms[roomName].links
            .filter(link => !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))
    }
    
    getContainer(creep) {
        return Game.rooms[creep.memory.owner].containers
            .filter(container => container.store.energy > 100).sort(this.compare.bind(creep))[0]
    }
    
    getContainers(roomName) {
        return Game.rooms[roomName].containers
            .filter(container => container && container.store.energy > 0 &&
                !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.container).some(sourceContainer => sourceContainer === container.id))
    }
    
    getContainerMine(creep) {
        return Object.values(Memory.ownedRooms[creep.memory.owner].sources)
            .map(source => Game.getObjectById(source.container))
            .filter(container => container && container.store.energy > creep.carryCapacity / 2).sort(this.compare.bind(creep))[0]
    }
    
    getStorage(roomName) {
        return Game.rooms[roomName].storage
    }
    
    getLink(roomName) {
        return Game.rooms[roomName].links
            .filter(link => link && link.energy > 0 &&
                !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))[0]
    }
    
    getNuke(roomName) {
        return Game.rooms[roomName].nuker
    }
    
    compare(a, b) {
        return this.pos.findPathTo(a) < this.pos.findPathTo(b) ? 1 : -1
    }
    
    getLinksMineCount(roomName) {
        return Object.values(Memory.ownedRooms[roomName].sources)
            .map(source => source.link).filter(link => link).length
    }
    
    getAllContainersMine(roomName) {
        return Object.values(Memory.ownedRooms[roomName].sources).map(source => Game.getObjectById(source.container)).filter(container => container)
    }
    
    getStructure(roomName, structureName) {
        return Game.rooms[roomName][structureName]
    }
    
}

module.exports = new RepositoryStructures