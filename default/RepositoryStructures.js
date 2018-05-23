class RepositoryStructures{
    getClosestStructureWithEnergy(creep){
        let creepCarry = creep.carry.energy
        let structures = ['extensions','spawns','towers','storage','container']
        while(structures){
            let structure = structures.shift()
            let availableStructures = Object.values(Memory.ownedRooms[creep.memory.owner][structure])
                                        .map(structureId => Game.getObjectById(structureId))
                                        .filter(structure => structure && (structure.energy < structure.energyCapacity || structure.storeCapacity - structure.store.energy >= creep.carry.energy/2))
            if(availableStructures.length === 1){
                return availableStructures[0]
            }else if(availableStructures.length > 1){
                return availableStructures
                    .reduce((prev,next)=> creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next)
            }
        }
        creep.say('Bug!!')
        return
    }
    getLinksMine(roomName){
        return Object.values(Memory.ownedRooms[roomName].sources)
                    .map(source => Game.getObjectById(source.link))
    }
    getLinks(roomName){
        if(!Memory.ownedRooms[roomName].links){
            return false
        }
        return Object.values(Memory.ownedRooms[roomName].links)
                .map(link => Game.getObjectById(link.id))
                .filter(link => link.energy > 0 
                    && !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))
    }
    getLinksAll(roomName){
        if(!Memory.ownedRooms[roomName].links){
            return false
        }
        return Object.values(Memory.ownedRooms[roomName].links)
                .map(link => Game.getObjectById(link.id))
                .filter(link => !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))
    }
    getContainer(roomName){
        if(_.isEmpty(Memory.ownedRooms[roomName].containers)){
            return false
        }
        return Object.values(Memory.ownedRooms[roomName].containers)
                .map(container => Game.getObjectById(container.id))
                .filter(container => container.energy > 0 
                    && !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.container).some(sourceContainer => sourceContainer === container.id))[0]
    }
    getStorage(roomName){
      return Game.rooms[roomName].storage
    }
    getLink(roomName){
        if(!Memory.ownedRooms[roomName].links){
            return false
        }
        return Object.values(Memory.ownedRooms[roomName].links)
                .map(link => Game.getObjectById(link.id))
                .filter(link => link.energy > 0 
                    && !Object.values(Memory.ownedRooms[roomName].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))[0]
    }
    compare(a,b){
        return this.pos.findPathTo(a) < this.pos.findPathTo(b) ? 1:-1
    }
}

module.exports = new RepositoryStructures