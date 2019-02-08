const RoleMiner = require('RoleMiner')
const RoleCarrier = require('RoleCarrier')
const RoleBuilder = require('RoleBuilder')
const RoleMineralMiner = require('RoleMineralMiner')
const RoleRepairer = require('RoleRepairer')
const RoleUpgrader = require('RoleUpgrader')
const RoleMineralFiller = require('RoleMineralFiller')
const RoleFiller = require('RoleFiller')
const RoleDefender = require('RoleDefender')
const RoleReserver = require('RoleReserver')
const RoleRemoteMiner = require('RoleRemoteMiner')
const RoleWrecker = require('RoleWrecker')
const RoleNukeLoader = require('RoleNukeLoader')
const RoleClaimer = require('RoleClaimer')
const RoleClaimBuilder = require('RoleClaimBuilder')

class RepositoryCreeps {
    constructor() {
        this.config()
    }
    
    calculatePriority(roomName, role) {
        const room = Memory.ownedRooms[roomName]
        const creepsMaximum = this.getCreepRoleMaximum(room, role)
        let priority = this.getCreepsPriority(room, role)
        const creepsCount = this.getCreepsCountByRole(room.name, role)

        if (creepsCount >= creepsMaximum) {
            return 0
        }
        if (creepsCount === 0) {
            priority += 2
        }
        if (creepsCount > creepsMaximum / 2) {
            priority -= 1
        }
        return priority
    }
    
    config() {
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
            [RoleReserver.getName()]: RoleReserver,
            [RoleRemoteMiner.getName()]: RoleRemoteMiner,
            [RoleWrecker.getName()]: RoleWrecker,
            [RoleNukeLoader.getName()]: RoleNukeLoader,
            [RoleClaimer.getName()]: RoleClaimer,
            [RoleClaimBuilder.getName()]: RoleClaimBuilder,
        }

    }
    
    getCreepsByRoles(roomName, creepRoles) {
        let creeps = []
        Object.values(Game.creeps)
            .filter(creep => filter(creep))
            .forEach(creep => {
                creeps.push(creep)
            })
        return creeps

        function filter(creep) {
            let isMatch = false
            creepRoles.forEach(creepRole => {
                if (creep.memory.role === creepRole && creep.memory.owner === roomName) {
                    isMatch = true
                }
            })
            return isMatch
        }
    }
    
    getCreepsInRoom(room){
        return Object.values(Game.creeps).filter(creep => creep && creep.memory.owner === room.name)
    }
    
    getCreepsCountByRole(roomName, creepRole) {
        return Object.values(Game.creeps).filter(creep => creep.memory.role === creepRole && (creep.ticksToLive > this.getRolePrespawn(creepRole) || creep.spawning) && creep.memory.owner === roomName).length
    }
    
    getAllCreepsCountByRole(creepRole) {
        return Object.values(Game.creeps).filter(creep => creep.memory.role === creepRole).length
    }
    
    getRolePrespawn(role) {
        return this.roles[role].getPrespawn()
    }
    
    getClosestCreepWithoutResources(creep) {
        let creeps = this.getCreepsByRoles(creep.memory.owner, [RoleUpgrader.getName(), RoleBuilder.getName()])
            .filter(creep => creep.carry.energy < creep.carryCapacity)
        if (creeps.length < 1) {
            return false
        }
        return creeps
            .reduce((prev, next) => {
                if (prev.carry.energy === next.carry.energy) {
                    return creep.pos.findPathTo(prev) < creep.pos.findPathTo(next) ? prev : next
                }
                return prev.carry.energy < next.carry.energy ? prev : next
            })
    }
    
    getCreepRoleMaximum(room, role) {
        if (_.isEmpty(this.roles)) {
            this.config()
        }


        if (typeof room === 'string') {
            room = Game.rooms[room]
        }
        return this.roles[role].getMaximum(room)
    }
    
    getCreepsMaximum(room) {
        if (_.isEmpty(this.roles)) {
            this.config()
        }

        let count = 0
        Object.values(this.roles).forEach(role => {

            count += role.getMaximum(room)
        })
        return count
    }
    
    getCreepsPriority(room, role) {
        if (_.isEmpty(this.roles)) {
            this.config()
        }
        if (typeof room === 'string') {
            room = Game.rooms[room]
        }
        return this.roles[role].getPriority(room)
    }
    
    getRoles() {
        return Object.keys(this.roles)
    }
    
    getCreepsBuild(room, role) {
        if (_.isEmpty(this.roles)) {
            this.config()
        }
        if (typeof room === 'string') {
            room = Game.rooms[room]
        }
        return this.roles[role].getBuild(room)
    }
}

module.exports = new RepositoryCreeps()