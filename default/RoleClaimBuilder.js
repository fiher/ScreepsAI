class RoleClaimBuilder {
    constructor() {
        this.name = 'ClaimBuilder'
        this.priority = 7
        this.prespawn = 400
    }
    getPriority(room) {
        return this.priority
    }
    getPrespawn() {
        return this.prespawn
    }
    getName() {
        return this.name
    }
    getMaximum(room) {
        if (Object.keys(Game.flags).filter(flag => flag.includes(room.name) && flag.includes('build')).length > 0) {
            return 4
        }
        return 0
    }
    getBuild(room) {
        let capacity = Game.rooms[room.name].energyCapacityAvailable
        let build = [WORK, WORK, MOVE, MOVE]
        switch (true) {
            case capacity > 2500:
                build = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
            case capacity > 1600:
                build = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
            case capacity > 1000:
                build = [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
        }
        return build
    }
    work(creep) {
        //TODO: Refactor this code so that it doesn't depend on having a flag after the spawn has been built and the builders can continue working
        if (!creep.memory.target) {
            return
            let site = Game.flags['build' + creep.memory.owner].room.find(FIND_CONSTRUCTION_SITES)// .filter(site => site.structureType === STRUCTURE_SPAWN)[0]
            if (site) {
                creep.memory.target = site.id
            } else {
                creep.memory.target = Game.flags['build' + creep.memory.owner].room.controller.id
            }
        }
        if (creep.memory.state === 'building' && creep.carry.energy > 0) {
            if (creep.build(Game.getObjectById(creep.memory.target)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target))
            } else if (creep.upgradeController(Game.getObjectById(creep.memory.target)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.target))
            }
            return
        }
        if (creep.memory.state === 'building' && creep.carry.energy === 0) {
            creep.memory.state = 'collecting'
            return
        }
        if (!creep.memory.source) {
            return
            let sources = Game.flags['build' + creep.memory.owner].room.find(FIND_SOURCES_ACTIVE)
            creep.pos.findPathTo(sources[0])
            if (sources.length > 1) {
                if (Game.time % 2 === 0) {
                    creep.memory.source = sources[1] ? sources[1].id : undefined
                } else {
                    creep.memory.source = sources[0] ? sources[0].id : undefined
                }
            }
        }
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.state = 'building'
            return
        }
        if (creep.harvest(Game.getObjectById(creep.memory.source)) === OK) {
            return
        }
        if (creep.moveTo(Game.getObjectById(creep.memory.source)) !== OK) {
            creep.memory.source = ''
        }

    }
}

module.exports = new RoleClaimBuilder