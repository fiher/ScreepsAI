const RepositoryCreeps = require('RepositoryCreeps')
const RepositoryStructures = require('RepositoryStructures')
const RoleCarrier = require('RoleCarrier')
const RoleBuilder = require('RoleBuilder')
const RoleRepairer = require('RoleRepairer')
const RoleUpgrader = require('RoleUpgrader')
const RoleMineralMiner = require('RoleMineralMiner')
const ConfigRooms = require('ConfigRooms')
class CollectingModule {
    constructor(){
        
    }
    
    main(room){
        room = Game.rooms[room.name] //From Memory.ownedRooms to Game room
        
        const droppedResources = room.find(FIND_DROPPED_RESOURCES,{filter : droppedResource => droppedResource.amount >= MINIMUM_WITHDRAW_ENERGY})
        const tombstones = room.find(FIND_TOMBSTONES,{filter : droppedResource => droppedResource.amount >= MINIMUM_WITHDRAW_ENERGY})
        const containersMine = RepositoryStructures.getAllContainersMine(room.name).filter(container => container.store.energy > MINIMUM_WITHDRAW_ENERGY)
        const containers = RepositoryStructures.getContainers(room.name)
        const links = RepositoryStructures.getStructure(room.name,STRUCTURE_LINKS).filter(link => link.energy > MINIMUM_WITHDRAW_ENERGY)
        
        const carrierTargets = [droppedResources,tombstones,containersMine, links, containers]
        const builderTargets = [containersMine, links, [room.storage, room.terminal], droppedResources, tombstones]
        const upgraderTargets = [[room.storage], links, containers, containersMine, tombstones, droppedResources]
        
        const carriersWithoutDestination = RepositoryCreeps.getCreepsByRoles(room.name,[RoleCarrier.getName()]).filter(carrier => !carrier.memory.destination && !carrier.spawning)
        const carriersWithoutTarget = RepositoryCreeps.getCreepsByRoles(room.name,[RoleCarrier.getName()]).filter(creep => !creep.memory.target && !creep.spawning)
        const buildersWithoutTarget = RepositoryCreeps.getCreepsByRoles(room.name,[RoleBuilder.getName()]).filter(creep => !creep.memory.target && !creep.spawning)
        const upgradersWithoutTarget = RepositoryCreeps.getCreepsByRoles(room.name,[RoleUpgrader.getName()]).filter(creep => !creep.memory.target && !creep.spawning)
        
        this.collecting(carriersWithoutTarget, carrierTargets)
        this.collecting(buildersWithoutTarget, builderTargets)
        //this.collecting(upgradersWithoutTarget, upgraderTargets)
        
        this.delivering(carriersWithoutDestination, containers, room.storage)
        
    }
    
    collecting(creeps, targets){
        targets = targets.filter(targetArr => targetArr).map(targetArr => targetArr.filter(target => target))
        creeps.forEach(creep => {
            targets.forEach(targetArray => {
                if(creep.memory.target){
                    return
                }
                if(targetArray.length > 0){
                    const target = targetArray.sort(this.compare.bind(creep))[0]
                    creep.memory.target = target.id
                    if(target.amount - creep.carryCapacity > MINIMUM_WITHDRAW_ENERGY 
                        || target.energy > MINIMUM_WITHDRAW_ENERGY 
                        || (target.store && target.store.energy - creep.carryCapacity > MINIMUM_WITHDRAW_ENERGY)){
                        targetArray.shift() // This line of code removes the current target from the inner array within `targets` which is outside of the loop.
                                            // This is why we need to check if the array is not empty
                    }
                }
            })
        })
    }
    
    delivering(creeps, containers, storage){
        creeps.map(creep => {
            if(storage && storage.store.energy < HIGH_STORAGE_ENERGY){
                creep.memory.destination = storage.id
                return creep
            }
            if(containers.length > 0){
                const container = containers.sort(this.compare.bind(creep))[0]
                creep.memory.destination = container.id
                if(container.store.energy - creep.carryCapacity > MINIMUM_WITHDRAW_ENERGY){
                    containers.shift()
                }
            }
            const destination = RepositoryStructures.getClosestStructureWithEnergy(creep)
            creep.memory.destination = destination.id
            if(!destination){
                const creepInNeed = RepositoryCreeps.getCreepsByRoles(creep.room.name,[RoleBuilder.getName(),RoleRepairer.getName()])
                                                                .filter(worker => worker.carryCapacity - worker.carry.energy > MINIMUM_WITHDRAW_ENERGY)
                                                                .sort(this.compare.bind(creep))[0]
                creep.memory.destination = creepInNeed ? creepInNeed.id : undefined
            }
            
        })
    }
    
    filling(creeps, targets, room){
        targets.map(targetStructures => room[targetStructures].filter(structure =>  structure && structure.energy < structure.energyCapacity))
        creeps.forEach(creep => {
            targets.forEach(targetStructures => {
                if(creep.memory.destination){
                    return
                }
                if(targetStructures.length > 1){
                    targetStructures.sort(this.compare.bind(creep))
                    creep.memory.destination = targetStructures.shift().id
                }
            })
        })
    }
    
    compare(a,b){
        return this.pos.findPathTo(a) < this.pos.findPathTo(b) ? 1:-1
    }
    
}
module.exports = new CollectingModule