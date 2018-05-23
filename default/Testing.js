        let builder = Game.creeps['ClaimBuilder']
        
        if(builder){
            if(builder.pos.roomName === Game.flags['claim']){
                builder.moveTo(Game.flags['claim'])
            }else{
                if(builder.carry.energy ===0){
                    builder.memory.collecting = true
                }else if(builder.carry.energy === builder.carryCapacity){
                    builder.memory.collecting = false
                }
                if(builder.memory.collecting){
                    let outcome = builder.harvest(Game.getObjectById('59f1a48382100e1594f3d0ca'))
                    if(outcome === ERR_NOT_IN_RANGE){
                        builder.moveTo(Game.getObjectById('59f1a48382100e1594f3d0ca'))
                    }
                }else{
                    let outcome = builder.upgradeController(Game.getObjectById('59f1a48382100e1594f3d0cb'))
                    if(outcome === ERR_NOT_IN_RANGE){
                        builder.moveTo(Game.getObjectById('59f1a48382100e1594f3d0cb'),{range:3})
                    }
                }
            }
        }
        OffensiveModule.wreckerSquad()
        Game.getObjectById('5ad5d89e1db6bf2fc4665134').boostCreep(Game.getObjectById('5ad8dc545918a62fa523bb91'))
        let filler = Game.creeps['TheChemist']
        filler.moveTo(Game.flags['fill'])
        
        if(1==1){
            if(filler.memory.done){
            //filler.transfer(Game.getObjectById('5ad543368909fd4eaf62c7a0'),RESOURCE_CATALYZED_GHODIUM_ALKALIDE,150)
            //if(1===0){
                filler.transfer(Game.getObjectById('5ad5d89e1db6bf2fc4665134'),RESOURCE_CATALYZED_GHODIUM_ALKALIDE,40)
            //}
            
            }else{
                filler.withdraw(Game.getObjectById('5ad543368909fd4eaf62c7a0'),RESOURCE_CATALYZED_GHODIUM_ALKALIDE,40)
                filler.memory.done = true
            }
            
        }
        
Game.getObjectById('5ad5d89e1db6bf2fc4665134').boostCreep(Game.getObjectById('5ad64d5a2b77662fa0889a25'))
        let filler = Game.creeps['TheChemist']
        
        if(filler.memory.done){
            //filler.transfer(Game.getObjectById('5ad543368909fd4eaf62c7a0'),RESOURCE_CATALYZED_GHODIUM_ALKALIDE,150)
            //if(1===0){
                filler.transfer(Game.getObjectById('5ad5d89e1db6bf2fc4665134'),RESOURCE_CATALYZED_ZYNTHIUM_ACID,150)
            //}
            
        }
        filler.withdraw(Game.getObjectById('5ad543368909fd4eaf62c7a0'),RESOURCE_CATALYZED_ZYNTHIUM_ACID,150)
        filler.memory.done = true
        if(filler){
            
            if(filler.carry.energy === filler.carryCapacity){
                
                //if(filler.transfer(Game.getObjectById('5ad5d89e1db6bf2fc4665134'),RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                //    filler.moveTo(Game.getObjectById('5ad5d89e1db6bf2fc4665134'))
                //}
            }
            else{
                
                //if(filler.withdraw(Game.getObjectById('5ad543368909fd4eaf62c7a0'),RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                //    filler.moveTo(Game.getObjectById('5ad543368909fd4eaf62c7a0'))
                //}
            }
        }

class Config{
    config(){
            this.rooms = new Map()
            Object.values(Game.rooms).map((room)=>{
                this.rooms.set(room.name,new Map())
                this.rooms.get(room.name).set('droppedResources',[])
                room.find(FIND_DROPPED_RESOURCES).forEach(droppedResource =>{
                    this.rooms.get(room.name).get('droppedResources').push(droppedResource.id)
                })
                room.find(FIND_STRUCTURES)
                    .filter(structure => structure.energy < structure.energyCapacity 
                    || structure.storage)
                    .map((structure)=>{
                        let key = structure.structureType + 's'
                        if(key){
                            //containers 1 block from an energy source are used by miners
                            if(key === 'containers' && structure.pos.findInRange(FIND_SOURCES,1).length >0){
                                if(!this.rooms.get(room.name).has('containersMine')){
                                    this.rooms.get(room.name).set('containersMine',[])
                                    this.rooms.get(room.name).get('containersMine').push(structure.id)
                                }
                            }else{
                                if(!this.rooms.get(room.name).has(key)){
                                    this.rooms.get(room.name).set(key,[])
                                }
                                this.rooms.get(room.name).get(key).push(structure.id)
                            }
                            
                        }
                    })
                //now find creeps to which to deliver energy if needed
                let creeps = Object.values(Game.creeps)
                                    .filter(creepFilter => creepFilter.room.name === room.name 
                                                    && creepFilter.carry.energy <= creepFilter.carryCapacity/2)
                if(creeps){
                    this.rooms.get(room.name).set('creeps',[])
                    creeps.forEach(creep =>{
                        this.rooms.get(room.name).get('creeps').push(creep.id)
                    })
                }
            })
        //console.log(this.rooms)
        }
}

/*
Аccepts splitted text and unlimited number of variables to be put between the text
The variables can be an object with .ToString() so that it says whatever find "human readable",
numbers, strings and arrays which will be represented as JSON
*/
function logger(splittedText){
    //remove first element which is splittedText
    let args = Array.prototype.slice.call(arguments,1)
    args.map( argument => {
        if(typeof argument === 'object'){
            return argument.toString()
        }else if(typeof argument === 'array'){
            return JSON.stringify(argument)
        }
    })
    let joinedText = ''
    for(i = 0; i<splittedText.length;i++){
        
        joinedText += splittedText[i]
        joinedText += args[i] ? args[i]:''
    }
    console.log(joinedText)
}
class RepositoryRooms {
    constructor(){
        Object.values(Game.rooms).filter(room => room.controller.my).forEach(room => {
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
            }else{
                Memory.ownedRooms[roomName].energyAvailable = room.energyAvailable
                Memory.ownedRooms[roomName].energyCapacityAvailable = room.energyCapacityAvailable
                Memory.ownedRooms[roomName].level = room.controller.level
            }
            room.find(FIND_STRUCTURES)
                .filter(structure => structure.structureType !== STRUCTURE_WALL 
                                    || structure.structureType !== STRUCTURE_RAMPART 
                                    || structure.structureType !== STRUCTURE_ROAD)
                .forEach(structure => {
                    if(Memory.ownedRooms[roomName][`${structure.structureType}s`][structure.id]){
                        return
                    }
                    Memory.ownedRooms[roomName][`${structure.structureType}s`][structure.id] = {
                        id: structure.id
                    }
                })
            if(!Memory.ownedRooms[room.name].sources){
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
            if(!Memory.ownedRooms[room.name].minerals){
                room.find(FIND_MINERALS).forEach(mineral => {
                    Memory.ownedRooms[room.name].minerals[mineral.id] = {
                        id:mineral.id,
                        type: mineral.mineralType,
                        container: '',
                    }
                })
            }
            Object.keys(Memory.ownedRooms[roomName].constructionSites).forEach(siteId => {
                if(!Game.getObjectById(siteId)){
                    delete Memory.ownedRooms[roomName].constructionSites[siteId]
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
    _countAccessibleTilesAroundSource(source){
        const area = source.room.lookForAtArea(LOOK_TERRAIN, source.pos.y - 1, source.pos.x - 1, source.pos.y + 1, source.pos.x + 1, true);
        return _.filter(area, t => t.terrain === "plain" || t.terrain === "swamp").length;
    }
    assignMinerToEnergySource(creep,roomName,sourceId){
        Memory.ownedRooms[roomName].sources[sourceId].creeps.push(creep.id)
        if(this._updateSourceMiningPotential(roomName,sourceId)){
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
            Object.values(room.sources).forEach((source)=>{
                let creepsLength = source.creeps.length
                source.creeps = source.creeps.filter(creepId => Game.getObjectById(creepId) && Game.getObjectById(creepId).ticksToLive > 30)
                if(creepsLength !== source.creeps.length){
                    this._updateSourceMiningPotential(room.name,source.id)
                }
            })
        })
    }
    _updateSourceMiningPotential(roomName,sourceId){
        let miningPotential = 0;
        Memory.ownedRooms[roomName].sources[sourceId].creeps.forEach(creepId=>{
            creep = Game.getObjectById(creepId)
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
}
