class ConfigRooms {
    constructor() {
        if (!Memory.ownedRooms) {
            Memory.ownedRooms = {}
        }
        if (!Memory.remoteRooms) {
            Memory.remoteRooms = {}
        }
        if (!Memory.rooms) {
            Memory.rooms = {}
        }
    }
    
    init() {
        Object.values(Game.rooms).forEach(room => {
            if (!room.controller) {
                this.setRoom(room)
                return
            }
            if (room.controller.my) {
                this.setOwnedRoom(room)
                this.setRoom(room)
                return
            }
            if (Object.keys(Game.flags).filter(flag => flag.includes(room.name) && flag.includes('remote'))) {
                let ownerRoomName = Object.keys(Game.flags).filter(flagName => flagName.includes("_" + room.name)).map(flag => flag.split("_")[1])[0]
                this.setRemoteRoom(room, ownerRoomName)
            }
            this.setRoom(room)
        })
        if (Game.time % 10000 === 0) {
            ConfigRooms.removeConstructionSites()
        }
    }
    
    removeConstructionSites() {
        Object.values(Memory.ownedRooms).forEach(room => {
            room.constructionSites = {}
        })
    }
    
    setRoom(room) {
        if (!Memory.rooms[room.name]) {
            let mineral = room.find(FIND_MINERALS)[0]
            Memory.rooms[room.name] = {
                name: room.name,
                lastUpdated: Game.time,
                costMatrix: this.getCostMatrix(room),
                mineral: mineral ? mineral.mineralType : undefined
            }
        }
        if (room.controller) {
            Memory.rooms[room.name].level = room.controller.level
            let owner = room.controller.owner ? room.controller.owner.username : undefined
            Memory.rooms[room.name].owner = owner
            Memory.rooms[room.name].mine = owner === 'fihercho' ? true : false
        }
        if (Game.time - Memory.rooms[room.name].lastUpdated > 10000) {
            Memory.rooms[room.name].costMatrix = this.getCostMatrix(room)
            Memory.rooms[room.name].lastUpdated = Game.time
        }
    }
    
    setRemoteRoom(room, ownerRoomName) {
        if (!Memory.remoteRooms[room.name]) {
            let roomData = {
                name: room.name,
                sources: {},
                minerals: {},
                controller: {
                    id: room.controller.id,
                    pos: {
                        x: room.controller.pos.x,
                        y: room.controller.pos.y
                    },
                    reserved: !!room.controller.reservation,
                    reservationEndTick: room.controller.reservation ? Game.time + room.controller.reservation.ticksToEnd : 0,
                },
                underAttack: false,
                threatLevel: 0,
                owner: ownerRoomName,
                containers: {},
                constructionSites: {}
            }
            Memory.remoteRooms[room.name] = roomData
            room.find(FIND_SOURCES).forEach(source => {
                Memory.remoteRooms[room.name].sources[source.id] = {
                    id: source.id,
                    energy: SOURCE_ENERGY_CAPACITY,
                    creeps: [],
                    maxCreepsCount: this._countAccessibleTilesAroundSource(source),
                    creepsMiningPotential: 0,
                    container: '',
                    link: '',
                }
            })
            room.find(FIND_MINERALS).forEach(mineral => {
                Memory.remoteRooms[room.name].minerals[mineral.id] = {
                    id: mineral.id,
                    type: mineral.mineralType,
                    container: '',
                }
            })
        }
        Memory.remoteRooms[room.name].controller.reserved = !!room.controller.reservation
        Memory.remoteRooms[room.name].controller.reservationEndTick = room.controller.reservation ? Game.time + room.controller.reservation.ticksToEnd : 0
        Object.values(Memory.remoteRooms[room.name].sources).forEach(source => {
            source.room = room.name
        })
        let constructionSites = room.find(FIND_CONSTRUCTION_SITES)
        constructionSites.forEach((constructionSite) => {
            if (!Memory.remoteRooms[room.name].constructionSites[constructionSite.id]) {
                Memory.remoteRooms[room.name].constructionSites[constructionSite.id] = {
                    id: constructionSite.id,
                    type: constructionSite.structureType
                }
            }
        })
    }
    
    setOwnedRoom(room) {
        if (!Memory.ownedRooms[room.name]) {
            Memory.ownedRooms[room.name] = {
                name: room.name,
                sources: {},
                minerals: {},
                controller: room.controller.id,
                energyCapacityAvailable: room.energyCapacityAvailable,
                emergency: false,
                underAttack: false,
                threatLevel: 0,
                level: room.controller.level,
                constructionSites: {},
            }
            room.find(FIND_SOURCES).forEach(source => {
                Memory.ownedRooms[room.name].sources[source.id] = {
                    id: source.id,
                    energy: SOURCE_ENERGY_CAPACITY,
                    creeps: [],
                    maxCreepsCount: this._countAccessibleTilesAroundSource(source),
                    creepsMiningPotential: 0,
                    container: '',
                    link: '',
                }
            })
            room.find(FIND_MINERALS).forEach(mineral => {
                Memory.ownedRooms[room.name].minerals[mineral.id] = {
                    id: mineral.id,
                    type: mineral.mineralType,
                    container: '',
                }
            })
        }
        Memory.ownedRooms[room.name].energyCapacityAvailable = room.energyCapacityAvailable
        Memory.ownedRooms[room.name].level = room.controller.level
        let constructionSites = room.find(FIND_CONSTRUCTION_SITES)
        constructionSites.forEach((constructionSite) => {
            if (!Memory.ownedRooms[room.name].constructionSites[constructionSite.id]) {
                Memory.ownedRooms[room.name].constructionSites[constructionSite.id] = {
                    id: constructionSite.id,
                    type: constructionSite.structureType
                }
            }
        })
        let sources = Object.values(Memory.ownedRooms[room.name].sources)
        sources.map(source => {
            if(!source){
                return source
            }
            let link = Game.getObjectById(source.link)
            let container = Game.getObjectById(source.container)
            if(!link){
                link = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 1, {
                                filter: structure => structure.structureType === STRUCTURE_LINK
                            })[0]
            }
            if(!container){
                container = Game.getObjectById(source.id).pos.findInRange(FIND_STRUCTURES, 1, {
                                        filter: structure => structure.structureType === STRUCTURE_CONTAINER
                                    })[0]
            }
            source.link = link ? link.id : ''
            source.container = container ? container.id : ''
            return source
        })
        
    }
    
    getCostMatrix(room) {
        let costMatrix = new PathFinder.CostMatrix
        room.find(FIND_STRUCTURES).forEach(function (struct) {
            if (struct.structureType === STRUCTURE_ROAD) {
                // Favor roads over plain tiles
                costMatrix.set(struct.pos.x, struct.pos.y, 1);
            } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                (struct.structureType !== STRUCTURE_RAMPART ||
                    !struct.my)) {
                // Can't walk through non-walkable buildings
                costMatrix.set(struct.pos.x, struct.pos.y, 0xff);
            }
        });
        room.find(FIND_SOURCES).forEach(source => {
            costMatrix.set(source.pos.x, source.pos.y, 0xff)
        })
        return JSON.stringify(costMatrix.serialize())
    }
    
    assignMinerToEnergySource(creep, roomName, sourceId) {
        Memory.ownedRooms[roomName].sources[sourceId].creeps.push(creep.id)
        if (this._updateSourceMiningPotential(roomName, sourceId)) {
            creep.memory.target = sourceId
            creep.memory.source = sourceId
            creep.memory.container = Memory.ownedRooms[roomName].sources[sourceId].container
            creep.memory.link = Memory.ownedRooms[roomName].sources[sourceId].link
            return true
        }
        return false
    }
    
    assignRemoteMinerToEnergySource(creep, source) {
        source.creeps.push(creep.id)
        if (this._updateMiningPotential(source)) {
            creep.memory.target = source.id
            creep.memory.source = source.id
            creep.memory.container = source.container
            creep.memory.link = source.link
            creep.memory.targetRoom = source.room
            return true
        }
        return false
    }
    
    removeDeadCreeps() {
        Object.values(Memory.ownedRooms).forEach((room) => {
            if (!room.sources) {
                return
            }
            Object.values(room.sources).map((source) => {
                source.creeps = source.creeps.filter(creepId => Game.getObjectById(creepId) && Game.getObjectById(creepId).ticksToLive > 30)
                this._updateSourceMiningPotential(room.name, source.id)
            })
        })

        Object.values(Memory.remoteRooms).forEach((remote) => {
            if (!remote.sources) {
                return
            }
            Object.values(remote.sources).map((source) => {
                source.creeps = source.creeps.filter(creepId => Game.getObjectById(creepId) && Game.getObjectById(creepId).ticksToLive > 30)
                this._updateMiningPotential(source)
            })
        })
    }
    
    _updateSourceMiningPotential(roomName, sourceId) {
        let miningPotential = 0;
        Memory.ownedRooms[roomName].sources[sourceId].creeps.forEach(creep => {
            creep = Game.getObjectById(creep)
            if (creep) {
                miningPotential += creep.body.filter(parts => parts.type === "work").length * HARVEST_POWER * ENERGY_REGEN_TIME
            }
        })
        Memory.ownedRooms[roomName].sources[sourceId].creepsMiningPotential = miningPotential
        if (!miningPotential) {
            return false
        }
        return true
    }
    
    _updateMiningPotential(source) {
        let miningPotential = 0;
        source.creeps.forEach(creep => {
            creep = Game.getObjectById(creep)
            if (creep) {
                miningPotential += creep.body.filter(parts => parts.type === "work").length * HARVEST_POWER * ENERGY_REGEN_TIME
            }
        })
        source.creepsMiningPotential = miningPotential
        if (!miningPotential) {
            return false
        }
        return true
    }
    
    _countAccessibleTilesAroundSource(source) {
        const area = source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        return _.filter(area, t => t.terrain === "plain" || t.terrain === "swamp").length;
    }

    removeDeadStructures(roomName) {
        this._removeContainersAndLinksFromAssignedStructures(roomName, 'sources')
        this._removeContainersAndLinksFromAssignedStructures(roomName, 'minerals')
    }
    
    _removeContainersAndLinksFromAssignedStructures(roomName, structureName) {
        Object.values(Memory.ownedRooms[roomName][structureName]).forEach(structure => {
            if (!Game.getObjectById(structure.container)) {
                source.container = ''
            }
            if (!Game.getObjectById(structure.link)) {
                source.link = ''
            }
        })
    }
}

module.exports = new ConfigRooms