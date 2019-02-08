let RepositoryStructures = require('RepositoryStructures')
class RoleMiner {
    constructor() {
        this.name = 'Miner'
        this.priority = 11
        this.prespawn = 20
    }
    getPriority(room) {
        return this.priority
    }
    getName() {
        return this.name
    }
    getPrespawn() {
        return this.prespawn
    }
    work(creep) {

        if (creep.memory.link && creep.carryCapacity > 0 && creep.carry.energy > creep.carryCapacity - 20) {
            let link = Game.getObjectById(creep.memory.link)
            creep.transfer(link, RESOURCE_ENERGY)
        }
        if (creep.memory.harvesting) {
            creep.harvest(Game.getObjectById(creep.memory.target))
            return
        }
        if (creep.memory.container) {
            let container = Game.getObjectById(creep.memory.container)
            if (container && !creep.pos.isEqualTo(container.pos.x, container.pos.y)) {
                creep.moveTo(container)
                return
            }
        }
        let source = Game.getObjectById(creep.memory.target)
        let result = creep.harvest(source)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                },
                range: 1
            })
            return
        } else if (result === OK) {
            creep.memory.harvesting = true
        }
    }
    getMaximum(room) {
        room = Memory.ownedRooms[room.name]
        let sources = Object.values(room.sources)


        let build = this.getBuild(room)
        if (!build) {
            return 0
        }
        let buildWorkParts = build.filter(part => part === WORK).length
        let workPartsNeeded = (sources.length * SOURCE_ENERGY_CAPACITY) / (HARVEST_POWER * ENERGY_REGEN_TIME)
        let maximumMiners = 0
        sources.forEach(source => maximumMiners += source.maxCreepsCount)
        let minersNeeded = Math.ceil(workPartsNeeded / buildWorkParts)

        return minersNeeded > maximumMiners ? maximumMiners : minersNeeded
    }
    getBuild(room) {
        if (room.emergency || Object.values(Game.creeps).filter(creep => creep.memory.owner === room.name).length === 0) {
            return [WORK, WORK, MOVE, MOVE]
        }
        let build = []
        let capacity = room.energyCapacityAvailable

        switch (true) {
            case (400 < capacity && capacity < 600):
                build = [WORK, WORK, WORK, MOVE, MOVE]
                break;
            case (600 <= capacity && capacity < 950):
                build = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
                break;
            case (950 <= capacity && !RepositoryStructures.getLinksMineCount(room.name)):
                build = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE]
                break;
            case (950 <= capacity && RepositoryStructures.getLinksMineCount(room.name) > 0):
                build = [CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
                break;
            default:
                build = [WORK, WORK, MOVE, MOVE]
                break;
        }
        return build
    }
}

module.exports = new RoleMiner