let RepositoryCreeps = require('RepositoryCreeps')
let RoleMiner = require('RoleMiner')
let RoleMineralMiner = require('RoleMineralMiner')
let ConfigRooms = require('ConfigRooms')
class MiningModule {
    constructor() {

    }
    main(room) {
        if (!room || !room.sources) {
            return false
        }
        let sources = Object.values(room.sources)
        sources = sources.map(source => {
            source.creeps = source.creeps.filter(creep => Game.getObjectById(creep))
            return source
        })
        sources = sources.filter(source => source.maxCreepsCount > source.creeps.length && source.energy > source.creepsMiningPotential)
        let miners = RepositoryCreeps.getCreepsByRoles(room.name, [RoleMiner.getName()]).filter(miner => !miner.memory.target && !miner.spawning)

        if (!sources.length || !miners.length) {
            return false
        }
        while (miners.length > 0 && sources.length > 0) {
            let miner = miners.shift()
            let source = sources[0]
            if (source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential) {
                sources.shift()
                source = sources[0]
            }
            this.assignMiner(miner, sources[0])

            if (source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential) {
                sources.shift()
            }
        }
    }
    mineralMining(room) {
        let mineral = Object.values(room.minerals)[0]
        let mineralMiners = RepositoryCreeps.getCreepsByRoles(room.name, [RoleMineralMiner.getName()]).filter(mineralMiner => !mineralMiner.memory.target && !mineralMiner.spawning)
        while (mineralMiners.length > 0 && mineral) {
            let mineralMiner = mineralMiners.shift()
            this.assignMineralMiner(mineralMiner, mineral)
        }
    }
    remoteMining(room) {
        let sources = []
        Object.values(Memory.remoteRooms).filter(remote => remote.owner === room.name).forEach(remote => {
            Object.values(remote.sources).forEach(source => {
                sources.push(source)
            })
        })
        let remoteMiners = RepositoryCreeps.getCreepsByRoles(room.name, [RoleRemoteMiner.getName()]).filter(remoteMiner => !remoteMiner.memory.targetRoom && !remoteMiner.spawning)
        if (!sources.length || !remoteMiners.length) {
            return false
        }
        while (remoteMiners.length > 0 && sources.length > 0) {
            let remoteMiner = remoteMiners.shift()
            let source = sources[0]
            if (source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential) {
                sources.shift()
                source = sources[0]
            }
            this.assignRemoteMiner(remoteMiner, sources[0])

            if (source.maxCreepsCount <= source.creeps.length && source.energy <= source.creepsMiningPotential) {
                sources.shift()
            }
        }
    }
    assignRemoteMiner(remoteMiner, source) {
        if (!source) {
            return
        }
        if (!source.container && Game.getObjectById(source.id)) {
            let container = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType === STRUCTURE_CONTAINER
            })[0]
            source.container = container ? container.id : false
        }
        if (!source.link && Game.getObjectById(source.id)) {
            let link = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 2, {
                filter: structure => structure.structureType === STRUCTURE_LINK
            })[0]
            source.link = link ? link.id : false
        }
        ConfigRooms.assignRemoteMinerToEnergySource(remoteMiner, source)
    }
    assignMineralMiner(mineralMiner, mineral) {
        mineralMiner.memory.target = mineral.id
        if (Game.getObjectById(mineral.container)) {
            mineralMiner.memory.container = mineral.container
            return
        }
        let container = Game.getObjectById(mineral.id).pos.findInRange(FIND_STRUCTURES, 1, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        })[0]
        if (container) {
            mineral.container = container.id
            mineralMiner.memory.container = container.id
            return
        }
    }
    assignMiner(miner, source) {
        if (!source) {
            return
        }
        if (!Game.getObjectById(source.container)) {
            let container = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType === STRUCTURE_CONTAINER
            })[0]
            source.container = container ? container.id : false
        }
        if (!Game.getObjectById(source.link)) {
            let link = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 2, {
                filter: structure => structure.structureType === STRUCTURE_LINK
            })[0]
            source.link = link ? link.id : false
        }
        ConfigRooms.assignMinerToEnergySource(miner, miner.memory.owner, source.id)

    }
}

module.exports = new MiningModule