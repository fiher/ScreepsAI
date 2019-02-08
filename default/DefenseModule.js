let RepositoryCreeps = require('RepositoryCreeps')
let RoleDefender = require('RoleDefender')
class DefenseModule {
    main(room) {
        room = Memory.ownedRooms[room.name]
        let gameRoom = Game.rooms[room.name] //this is needed because the parameter passed is `Memory.ownedRooms`
        let hostileCreeps = gameRoom.find(FIND_HOSTILE_CREEPS).filter(creep => creep.getActiveBodyparts(ATTACK) ||
            creep.getActiveBodyparts(RANGED_ATTACK) ||
            creep.getActiveBodyparts(WORK) ||
            creep.getActiveBodyparts(CLAIM))
        if (hostileCreeps.length < 1) {
            room.underAttack = false
            room.threatLevel = 0
            return
        }
        room.underAttack = true
        if (!room.threatLevel) {
            this.underAttack = true
            this.defineThreatLevel(room, hostileCreeps)
        }
        this.shoot(room, hostileCreeps)
    }
    
    defineThreatLevel(room, hostileCreeps) {
        let owners = {}
        hostileCreeps.forEach(hostile => {
            if (!owners[hostile.owner.username]) {
                owners[hostile.owner.username] = hostile.owner.username
            }
        })
        let ownersLength = Object.keys(owners).length
        if (ownersLength === 1 && owners['Invader']) {
            room.threatLevel = 1
            return
        }
    }
    
    shoot(room, hostileCreeps) {
        let towers = Game.rooms[room.name].towers.filter(tower => tower)
        towers.forEach(tower => {
            tower.attack(hostileCreeps[0])
        })
        return
        let result = _(towers)
            .zip(_(hostileCreeps).shuffle().value())
            .forEach(t => {
                !_.some(t, x => !x) &&
                    //zip returns an array of arrays as pairs which ends up like [tower,target] so by saying t[0] we get the tower and t[1] is the target
                    t[0].attack(t[1])
            })
    }
    
    defend() {
        if (!Game.flags.defend) {
            return
        }
        let defenders = Object.values(Game.creeps).filter(creep => creep.memory.role === RoleDefender.getName())
        let room = Game.flags.defend.pos.roomName
        if (Game.rooms[room]) {
            room = Game.rooms[room]
            let enemyClaimers = room.find(FIND_HOSTILE_CREEPS).filter(creep => creep.getActiveBodyparts(CLAIM)).filter(creep => creep.pos.x !== 49 && creep.pos.x !== 0 && creep.pos.y !== 0 && creep.pos.y !== 49)
            let enemyDefenders = room.find(FIND_HOSTILE_CREEPS).filter(creep => creep.getActiveBodyparts(ATTACK) ||
                creep.getActiveBodyparts(RANGED_ATTACK) ||
                creep.getActiveBodyparts(HEAL)).filter(creep => creep.pos.x !== 49 && creep.pos.x !== 0 && creep.pos.y !== 0 && creep.pos.y !== 49)
            let enemyEconomys = room.find(FIND_HOSTILE_CREEPS).filter(creep => creep.getActiveBodyparts(WORK) ||
                creep.getActiveBodyparts(CARRY)).filter(creep => creep.pos.x !== 49 && creep.pos.x !== 0 && creep.pos.y !== 0 && creep.pos.y !== 49)

            if (enemyClaimers.length > 0) {
                defenders.forEach(defender => defender.memory.target = enemyClaimers[0].id)
                return
            }
            if (enemyDefenders.length > 0) {
                defenders.forEach(defender => defender.memory.target = enemyDefenders[0].id)
                return
            }
            if (enemyEconomys.length > 0) {
                defenders.forEach(defender => defender.memory.target = enemyEconomys[0].id)
                return
            }
        }
    }
}

module.exports = new DefenseModule