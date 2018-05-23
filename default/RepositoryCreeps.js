let RoleMiner = require('RoleMiner')
let RoleCarrier = require('RoleCarrier')
let RoleBuilder = require('RoleBuilder')
let RoleMineralMiner = require('RoleMineralMiner')
let RoleRepairer = require('RoleRepairer')
let RoleUpgrader = require('RoleUpgrader')
let RoleMineralFiller = require('RoleMineralFiller')
let RoleFiller = require('RoleFiller')
let RoleDefender = require('RoleDefender')
class RepositoryCreeps {
    constructor(){
        this.config()
    }
    config(){
        
        this.roles = {
            [RoleMiner.getName()]: RoleMiner,
            [RoleCarrier.getName()]: RoleCarrier,
            [RoleBuilder.getName()]: RoleBuilder,
            [RoleMineralMiner.getName()]: RoleMineralMiner,
            [RoleRepairer.getName()]: RoleRepairer,
            [RoleUpgrader.getName()]: RoleUpgrader,
            [RoleMineralFiller.getName()]: RoleMineralFiller,
            [RoleFiller.getName()]: RoleFiller,
            [RoleDefender.getName()]: RoleDefender,
        }
        
    }
    getCreepsByRoles(roomName,creepRoles){
        let creeps = []
        
        Object.values(Game.creeps)
            .filter(creep => filter(creep))
            .forEach((creep)=>{creeps.push(creep)})
        return creeps
        
        function filter(creep){
            let isMatch = false
            creepRoles.forEach((creepRole)=>{
                
                if(creep.memory.role === creepRole && creep.memory.owner === roomName){
                    isMatch = true
                }
            })
            return isMatch
        }
    }
    getCreepsCountByRole(roomName,creepRole){
        return Object.values(Game.creeps).filter(creep => creep.memory.role === creepRole && (creep.ticksToLive > 29 || creep.spawning) && creep.memory.owner === roomName).length
    }
    getClosestCreepWithoutResources(creep){
        let creeps = this.getCreepsByRoles(creep.memory.owner,[RoleUpgrader.getName(),RoleBuilder.getName()])
                        .filter(creep=> creep.carry.energy < creep.carryCapacity)
        if(creeps.length <1){
            return false
        }
        return creeps
                .reduce((prev,next)=>{
                    if(prev.carry.energy === next.carry.energy){
                        return creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev:next
                    }
                    return prev.carry.energy < next.carry.energy ? prev:next
                })
    }
    getCreepRoleMaximum(room,role){
        if(_.isEmpty(this.roles)){
            this.config()
        }
        
        
        if(typeof room === 'string'){
            room = Game.rooms[room]
        }
        return this.roles[role].getMaximum(room)
    }
    getCreepsMaximum(room){
        if(_.isEmpty(this.roles)){
            this.config()
        }
        
        let count = 0
        Object.values(this.roles).forEach(role => {
            
            count += role.getMaximum(room)
        })
        return count
    }
    getCreepsPriority(room,role){
        if(_.isEmpty(this.roles)){
            this.config()
        }
        if(typeof room === 'string'){
            room = Game.rooms[room]
        }
        return this.roles[role].getPriority(room)
    }
    getRoles(){
        return Object.keys(this.roles)
    }
    getCreepsBuild(room,role){
        if(_.isEmpty(this.roles)){
            this.config()
        }
        if(typeof room === 'string'){
            room = Game.rooms[room]
        }
        return this.roles[role].getBuild(room)
    }
}

module.exports = new RepositoryCreeps()