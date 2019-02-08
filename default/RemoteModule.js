const RepositoryCreeps = require('RepositoryCreeps')
const RoleReserver = require('RoleReserver')
const RoleMiner = require('RoleMiner')
const RoleRemoteMiner = require('RoleRemoteMiner')
const ConfigRooms = require('ConfigRooms')
class RemoteModule {
    constructor() {

    }
    
    main(room) {
        const remotes = Object.values(Memory.remoteRooms).filter(remoteRoom => remoteRoom.owner === room.name)

        if (remotes.length) {
            this.reserve(room, remotes)
            this.mine(room, remotes)
        }
    }
    
    reserve(room, remotes) {
        const reservers = RepositoryCreeps.getCreepsByRoles(room.name, [RoleReserver.getName()]).filter(reserver => !reserver.memory.targetRoom)
        while (remotes.length && reservers.length) {
            let reserver = reservers.shift()
            const remote = remotes.shift()
            reserver.memory.targetRoom = remote.name
            reserver.memory.target = remote.controller.id
        }
    }
    
    mine(room, remotes) {
        if (!room || !remotes) {
            return false
        }
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
    
    build(room) {
        let constructionSites = Object.values(room.constructionSites).filter(site => Game.getObjectById(site.id))
        if (constructionSites.length < 1) {
            return
        }
        let remoteBuilders = RepositoryCreeps.getCreepsByRoles(room.name, [RoleRemoteBuilder.getName()]).filter(remoteBuilder => !remoteBuilder.memory.targetRoom && !remoteMiner.spawning)
        while (constructionSites.length > 0 && remoteBuilders.length > 0) {
            remoteBuilders.forEach(remoteBuilder => {
                remoteBuilder.memory.target = constructionSites[0].id
                remoteBuilder.memory.targetRoom = constructionSites[0].room
            })
        }
        remoteBuilders = RepositoryCreeps.getCreepsByRoles(room.name, [RoleRemoteBuilder.getName()]).filter(remoteBuilder => !remoteBuilder.memory.destination && remoteBuilder.memory.targetRoom && !remoteMiner.spawning)


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
}

module.exports = new RemoteModule