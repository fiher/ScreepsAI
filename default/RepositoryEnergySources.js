class RepositoryEnergySources {
    getContainer(creep){
        if(_.isEmpty(Memory.ownedRooms[creep.memory.owner].containers)){
            return false
        }
        return Object.values(Memory.ownedRooms[creep.memory.owner].containers)
                .map(container => Game.getObjectById(container.id))
                .filter(container => container.energy > 0 
                    && !Object.values(Memory.ownedRooms[creep.memory.owner].sources).map(source => source.container).some(sourceContainer => sourceContainer === container.id))[0]
    }
    getStorage(creep){
      return Game.rooms[creep.memory.owner].storage
    }
    getContainerMine(creep){
        return Object.values(Memory.ownedRooms[creep.memory.owner].sources)
                    .map(source => Game.getObjectById(source.container))
                    .filter(container => container && container.store.energy > creep.carryCapacity/2).sort(this.compare.bind(creep))[0]
    }
    getLinksMineCount(roomName){
        return Object.values(Memory.ownedRooms[roomName].sources)
                    .map(source => source.link).filter(link => link).length
    }
    getLinksMine(roomName){
        return Object.values(Memory.ownedRooms[creep.memory.owner].sources)
                    .map(source => Game.getObjectById(source.link))
    }
    getLinks(creep){
        if(!Memory.ownedRooms[creep.memory.owner].links){
            return false
        }
        return Object.values(Memory.ownedRooms[creep.memory.owner].links)
                .map(link => Game.getObjectById(link.id))
                .filter(link => link.energy > 0 
                    && !Object.values(Memory.ownedRooms[creep.memory.owner].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))
    }
    getLink(creep){
        if(!Memory.ownedRooms[creep.memory.owner].links){
            return false
        }
        return Object.values(Memory.ownedRooms[creep.memory.owner].links)
                .map(link => Game.getObjectById(link.id))
                .filter(link => link.energy > 0 
                    && !Object.values(Memory.ownedRooms[creep.memory.owner].sources).map(source => source.link).some(sourceLink => sourceLink === link.id))[0]
    }
    compare(a,b){
        return this.pos.findPathTo(a) < this.pos.findPathTo(b) ? 1:-1
    }
}
module.exports = new RepositoryEnergySources