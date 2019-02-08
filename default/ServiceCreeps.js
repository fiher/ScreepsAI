class ServiceCreeps {
    harvest(creep) {
        if (creep.memory.mining) {
            creep.harvest(Game.getObjectById(creep.memory.target))
            return
        }
        if (creep.memory.container) {
            let container = Game.getObjectById(creep.memory.container)
            if (container && !creep.pos.isEqualTo(container.pos.x, container.pos.y)) {
                creep.moveTo(container)
                return
            }
        }
        let source = Game.getObjectById(creep.memory.target)
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            let result = creep.moveTo(source, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                },
                range: 1
            })
            return
            return
        }
        //creep.say("Mining")
    }
    upgrade(creep) {
        const controller = Game.getObjectById(creep.memory.destination)
        if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                },
                range: 3
            })
            //creep.say("Upgrading")
            return true
        }
        return false
    }
    build(creep) {
        const destination = Game.getObjectById(creep.memory.destination)
        if (creep.carry.energy === 0 || !destination) {
            return false
        }
        const result = creep.build(destination)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(destination, {
                range: 3
            })
        } else {
            return false
        }
        return true
    }
    deliver(creep) {
        let destination = Game.getObjectById(creep.memory.destination)
        if (!destination) {
            return false
        }
        let result = creep.transfer(destination, RESOURCE_ENERGY)
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(destination, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                },
                range: 1
            })
            //creep.say('To Deliver!')
            return true
        } else if (result === OK) {
            creep.say("Delivering!")
            // we return false just so the controller will look for another destination
            return false
        }
        return false
    }
    collect(creep) {
        const target = Game.getObjectById(creep.memory.target)
        if (!target) {
            return false
        }
        let result = ''
        if (target.energy) {
            result = creep.pickup(target)
            if (result === -7) {
                result = creep.withdraw(target, RESOURCE_ENERGY)
            }
        } else {
            if (target.store && target.store.energy < creep.carryCapacity / 2) {
                return false
            }
            result = creep.withdraw(target, RESOURCE_ENERGY)
        }
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {
                range: 1
            })
            return true
        } else if (result === OK) {
            return false
        }
        return false
    }
    collecting(creep) {
        const target = Game.getObjectById(creep.memory.target)
        if (!target) {
            return false
        }
        let outcome = true
        if (target.structureType) {
            outcome = creep.withdraw(target, RESOURCE_ENERGY)
        } else {
            outcome = creep.pickup(target)
        }
        return !outcome //OK is 0 which is false, so we need the opposite
    }
    
    moveToRoom(creep) {
        if (creep.memory.targetRoom === creep.pos.roomName && creep.pos.x !== 49 && creep.pos.y !== 49 && creep.pos.x !== 0 && creep.pos.x !== 0) {
            return false
        }
        creep.moveTo(new RoomPosition(25, 25, creep.memory.targetRoom))
        return true
    }
    
    moveToTarget(creep, range = 1) {
        const target = Game.getObjectById(creep.memory.target)
        if (creep.pos.isNearTo(target)) {
            return false
        }
        return !creep.moveTo(target, {range}) //The value for OK is 0 so I need to revert it and from false to make it true while any error is >0 so it becomes false
    }
    
    moveToDestination(creep, range = 1) {
        const destination = Game.getObjectById(creep.memory.destination)
        if (creep.pos.isNearTo(destination)) {
            return false
        }
        return !creep.moveTo(destination, {range})
    }
    
    moveToController(creep){
        console.log(creep.room.controller)
        return !creep.moveTo(creep.room.controller,{range: 3})
    }
    
    harvesting(creep) {
        const outcome = creep.harvest(Game.getObjectById(creep.memory.target))
        if (outcome !== OK) {
            return false
        }
        return true
    }
    delivering(creep) {
        const destination = Game.getObjectById(creep.memory.destination)
        if (!destination) {
            return false
        }
        const outcome = creep.transfer(destination, RESOURCE_ENERGY)
        if (outcome !== OK) {
            return false
        }
        return true
    }
    reserving(creep) {
        const outcome = creep.reserveController(Game.getObjectById(reserver.memory.target))
        if (outcome !== OK) {
            return false
        }
        return true
    }
    
    repairing(creep) {
        const outcome = creep.repair(Game.getObjectById(creep.memory.target))
        if (outcome != OK) {
            return false
        }
        return true
    }
    
    upgrading(creep) {
        return !creep.upgradeController(creep.room.controller) // OK is coded as 0 which is false, but we want true
    }
    
    isOnExit(creep) {
        if (creep.pos.x === 49 || creep.pos.y === 49 || creep.pos.x === 0 || creep.pos.y === 0) {
            return true
        }
        return false
    }
    
    building(creep) {
        const outcome = creep.build(Game.getObjectById(creep.memory.destination))
        if (outcome !== OK) {
            return false
        }
        return true
    }

}
module.exports = new ServiceCreeps