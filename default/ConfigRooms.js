//DEPRECATED 
/*
This class was made when I wanted to store information about a room in memory globally.
Since then with the adding of additional stuff I came with a better solution
Each `Repository` should collect data on its own.
This class is the result of switching between design patterns.

So far it is still used because my colony still needs to be active. 
However the code in this class is a bucnh of `fast fixes` to keep the colony working
To see what the code will look like head to files with the name `New`

*/

class ConfigRooms {
    setConfig(){
        if(!Memory.rooms){
            Memory.rooms = {}
        }
        
        Object.values(Game.spawns).map((spawn)=>{
            let room = spawn.room
            let roomName = room.name
            if(!Memory.rooms[roomName]){
                Memory.rooms[roomName] = {}
                Memory.rooms[roomName].name = roomName
                Memory.rooms[roomName].controller = room.controller.id
                Memory.rooms[roomName].level = room.controler.level
                Memory.rooms[roomName].energySources = {}
                Memory.rooms[roomName].spawns = {}
                Memory.rooms[roomName].constructionSites = {}
                Memory.rooms[roomName].links = {}
                Memory.rooms[roomName].linksMIne = {}
                Memory.rooms[roomName].extentions = {}
                Memory.rooms[roomName].towers = {}
                Memory.rooms[roomName].containers = {}
                Memory.rooms[roomName].containersMine = {}
                Memory.rooms[roomName].remoteRooms = {}
                Memory.rooms[roomName].emergency = false
                Memory.rooms[roomName].underAttack = false
                Memory.rooms[roomName].threatLevel = 0
                Memory.rooms[roomName].constructionSites = {}
            }else{
                Memory.rooms[roomName].energyAvailable = room.energyAvailable
                Memory.rooms[roomName].energyCapacityAvailable = room.energyCapacityAvailable
                Memory.rooms[roomName].level = room.controller.level
                Memory.rooms[roomName].name = roomName
                
            }
            if(!Memory.rooms[roomName].spawns){
                Memory.rooms[roomName].spawns = {}
            }
            if(!Memory.rooms[roomName].spawns[spawn.id]){
                Memory.rooms[roomName].spawns[spawn.id] = spawn.id
            }
            if(!Memory.rooms[roomName].energySources){
                Memory.rooms[roomName].energySources = {}
            }
            if(!Memory.rooms[roomName].hasOwnProperty('linksMine')){
                Memory.rooms[roomName].linksMine = {}
            }
            if(!Memory.rooms[roomName].hasOwnProperty('links')){
                Memory.rooms[roomName].links = {}
            }
            if(!Memory.rooms[roomName].constructionSites){
                Memory.rooms[roomName].constructionSites = {}
            }
            if(!Memory.rooms[roomName].extentions){
                Memory.rooms[roomName].extentions = {}
            }
            if(!Memory.rooms[roomName].containers){
                Memory.rooms[roomName].containers = {}
            }
            if(!Memory.rooms[roomName].towers){
                Memory.rooms[roomName].towers = {}
            }
            if(!Memory.rooms[roomName].containersMine){
                Memory.rooms[roomName].containersMine = {}
            }
            room.find(FIND_STRUCTURES)
                    .forEach((structure)=>{
                        //console.log(structure.structureType)
                        if(structure.structureType === STRUCTURE_EXTENSION){
                            if(!Memory.rooms[roomName].extentions[structure.id]){
                            Memory.rooms[roomName].extentions[structure.id]= {
                                id:structure.id,
                                pos:structure.pos,
                                energy:structure.energy,
                                energyCapacity:structure.energyCapacity
                            }
                            }else{
                                Memory.rooms[roomName].extentions[structure.id].energy = structure.energy
                            }
                        }else if(structure.structureType  === STRUCTURE_STORAGE){
                            if(!Memory.rooms[roomName].storage){
                                Memory.rooms[roomName].storage = {
                                    id:structure.id,
                                    pos:structure.pos
                                }
                            }
                        }else if(structure.structureType  === STRUCTURE_TERMINAL){
                            if(!Memory.rooms[roomName].terminal){
                                Memory.rooms[roomName].terminal = {
                                    id:structure.id,
                                    pos:structure.pos
                                }
                            }
                        }else if(structure.structureType === STRUCTURE_TOWER){
                            if(!Memory.rooms[roomName].towers[structure.id]){
                                Memory.rooms[roomName].towers[structure.id]= {
                                    id:structure.id,
                                    pos:structure.pos,
                                    energy:structure.energy,
                                    energyCapacity:structure.energyCapacity
                                }
                            }else{
                                Memory.rooms[roomName].towers[structure.id].energy = structure.energy
                            }
                        }else if(structure.structureType === STRUCTURE_CONTAINER){
                            if(structure.pos.findInRange(FIND_SOURCES,1).length >0){
                                if(Memory.rooms[roomName].containersMine[structure.id]){
                                    Memory.rooms[roomName].containersMine[structure.id].energy = structure.store.energy
                                }
                                Memory.rooms[roomName].containersMine[structure.id]= {
                                    id:structure.id,
                                    pos:structure.pos,
                                    energy:structure.store.energy,
                                    energyCapacity:structure.storeCapacity
                                }
                            }
                            else{
                                Memory.rooms[roomName].containers[structure.id]= {
                                    id:structure.id,
                                    pos:structure.pos,
                                    energy:structure.storage,
                                    energyCapacity:structure.storageCapacity
                                }
                            }
                        }else if(structure.structureType === STRUCTURE_LINK){
                            
                            if(structure.pos.findInRange(FIND_SOURCES,2).length >0){
                                
                                if(Memory.rooms[roomName].linksMine[structure.id]){
                                    Memory.rooms[roomName].linksMine[structure.id].energy = structure.energy
                                    return
                                }
                                console.log(structure)
                                Memory.rooms[roomName].linksMine[structure.id]= {
                                    id:structure.id,
                                    pos:structure.pos,
                                    energy:structure.energy,
                                    energyCapacity:structure.energyCapacity
                                    
                                }
                            }else{
                                if(Memory.rooms[roomName].links[structure.id]){
                                    Memory.rooms[roomName].links[structure.id].energy = structure.energy
                                    return
                                }
                                Memory.rooms[roomName].links[structure.id]= {
                                    id:structure.id,
                                    pos:structure.pos,
                                    energy:structure.energy,
                                    energyCapacity:structure.energyCapacity
                                }
                                
                            }
                        }
                    })
            let constructionSites = room.find(FIND_CONSTRUCTION_SITES)
            constructionSites.forEach((constructionSite)=>{
                if(!Memory.rooms[roomName].constructionSites[constructionSite.id]){
                    Memory.rooms[roomName].constructionSites[constructionSite.id]= {
                        id:constructionSite.id,
                        type:constructionSite.structureType,
                        pos:constructionSite.pos
                    }
                }
            })
        })
    }
    assignMinerToEnergySource(creep,roomName,sourceId){
        Memory.ownedRooms[roomName].sources[sourceId].creeps.push(creep.id)
        if(this._updateSourceMiningPotential(roomName,sourceId)){
            creep.memory.target = sourceId
            creep.memory.source = sourceId
            creep.memory.container = Memory.ownedRooms[roomName].sources[sourceId].container
            creep.memory.link = Memory.ownedRooms[roomName].sources[sourceId].link
            return true
        }
        return false
    }
    removeDeadCreeps(){
        Object.values(Memory.ownedRooms).forEach((room)=>{
            if(!room.sources){
                return
            }
            Object.values(room.sources).map((source)=>{
                source.creeps = source.creeps.filter(creepId => Game.getObjectById(creepId) && Game.getObjectById(creepId).ticksToLive > 30)
                this._updateSourceMiningPotential(room.name,source.id)
            })
            if(!room.remoteRooms){
                return
            }
            
        })
    }
    _updateSourceMiningPotential(roomName,sourceId){
        let miningPotential = 0;
        Memory.ownedRooms[roomName].sources[sourceId].creeps.forEach(creep=>{
            creep = Game.getObjectById(creep)
            if(creep){
                miningPotential += creep.body.filter(parts => parts.type === "work").length * HARVEST_POWER * ENERGY_REGEN_TIME
            }
        })
        Memory.ownedRooms[roomName].sources[sourceId].creepsMiningPotential = miningPotential
        if(!miningPotential){
            return false
        }
        return true
    }
    _countAccessibleTilesAroundSource(source){
        const area = source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        return _.filter(area, t => t.terrain === "plain" || t.terrain === "swamp").length;
    }
    init(){
        Object.values(Game.rooms).filter(room => room.controller && room.controller.my).forEach(room => {
            let roomName = room.name
            if(!Memory.ownedRooms){
                Memory.ownedRooms = {}
            }
            if(!Memory.ownedRooms[roomName]){
                Memory.ownedRooms[roomName] = {
                    name:roomName,
                    sources:{},
                    minerals: {},
                    controller: room.controller.id,
                    energyCapacityAvailable: room.energyCapacityAvailable,
                    towers: {},
                    containers: {},
                    links: {},
                    extensions: {},
                    spawns: {},
                    powerSpawns:{},
                    nukes:{},
                    labs:{},
                    emergency:false,
                    underAttack: false,
                    threatLevel:0,
                    level: room.controller.level,
                    constructionSites: {},
                }
            }
            Memory.ownedRooms[roomName].energyCapacityAvailable = room.energyCapacityAvailable
            Memory.ownedRooms[roomName].level = room.controller.level
            room.find(FIND_STRUCTURES)
                .filter(structure => structure.structureType !== STRUCTURE_WALL 
                                    && structure.structureType !== STRUCTURE_RAMPART 
                                    && structure.structureType !== STRUCTURE_ROAD
                                    && structure.structureType !== STRUCTURE_STORAGE
                                    && structure.structureType !== STRUCTURE_TERMINAL
                                    && structure.structureType !== STRUCTURE_CONTROLLER
                                    && structure.structureType !== STRUCTURE_EXTRACTOR)
                .forEach(structure => {
                    if(!Memory.ownedRooms[roomName][`${structure.structureType}s`]){
                        Memory.ownedRooms[roomName][`${structure.structureType}s`] = {}
                    }
                    if(Memory.ownedRooms[roomName][`${structure.structureType}s`][structure.id]){
                        return
                    }
                    Memory.ownedRooms[roomName][`${structure.structureType}s`][structure.id] = {
                        id: structure.id
                    }
                })
            if(_.isEmpty(Memory.ownedRooms[room.name].sources)){
                room.find(FIND_SOURCES).forEach(source => {
                    Memory.ownedRooms[room.name].sources[source.id] = {
                        id:source.id,
                        energy: SOURCE_ENERGY_CAPACITY,
                        creeps: [],
                        maxCreepsCount: this._countAccessibleTilesAroundSource(source),
                        creepsMiningPotential: 0,
                        container: '',
                        link: '',
                    }
                })
            }
            if(_.isEmpty(Memory.ownedRooms[room.name].minerals)){
                room.find(FIND_MINERALS).forEach(mineral => {
                    Memory.ownedRooms[room.name].minerals[mineral.id] = {
                        id:mineral.id,
                        type: mineral.mineralType,
                        container: '',
                    }
                })
            }
            let constructionSites = room.find(FIND_CONSTRUCTION_SITES)
            constructionSites.forEach((constructionSite)=>{
                if(!Memory.ownedRooms[roomName].constructionSites[constructionSite.id]){
                    Memory.ownedRooms[roomName].constructionSites[constructionSite.id]= {
                        id:constructionSite.id,
                        type:constructionSite.structureType
                    }
                }
            })
            if(!Memory.ownedRooms[roomName].constructionSites){
                Memory.ownedRooms[roomName].constructionSites = {}
            }
            Object.values(Memory.ownedRooms[roomName].constructionSites).forEach(site =>{
                if(!Game.getObjectById(site.id)){
                    delete Memory.rooms[roomName].constructionSites[site.id]
                }
            })
            
        })
    }
}

module.exports = new ConfigRooms