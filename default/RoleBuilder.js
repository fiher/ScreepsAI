const ServiceCreeps = require('ServiceCreeps')

class RoleBuilder {
    constructor() {
        this.name = 'Builder'
        this.priority = 7
        this.prespawn = 30
    }
    getPriority(room) {
        return this.priority
    }
    getName() {
        return this.name
    }
    getPrespawn() {
        return this.prespawn
    }
    getMaximum(room) {
        let wantedWorkParts = 0
        let constructionSites = room.constructionSites ? Object.values(room.constructionSites) : []
        if (constructionSites.length === 0) {
            wantedWorkParts = 0
        }
        let totalCost = 0
        constructionSites.map(site => Game.getObjectById(site.id)).filter(site => site).forEach(site => totalCost += site.progressTotal)
        if(totalCost > 0 && Game.rooms[room.name].storage.store.energy < LOW_STORAGE_ENERGY){
            return 0
        }
        switch(true){
            case (totalCost === 0 ):
                return 0
                break
            case (totalcost < 10000):
                return 3
                break
            case (totalCost < 50000):
                return 5
                break
            case (totalCost < 150000):
                return 7
                break
            default:
                return 0
                break
        }
        let build = this.getBuild(room)
        return Math.floor(wantedWorkParts / build.filter(part => part === WORK).length)
    }
    getBuild(room) {
        let build = [CARRY, CARRY, CARRY, WORK, MOVE]
        switch (true) {
            case (room.energyCapacityAvailable > 2000):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 1000):
                build = [CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 600):
                build = [CARRY, CARRY, CARRY, CARRY, WORK, WORK, MOVE, MOVE, MOVE]
                break
        }
        return build
    }
    work(creep) {
        switch (creep.memory.state) {
            case CREEP_BUILDING:
                if (!ServiceCreeps.building(creep)) {
                    creep.memory.state = CREEP_IDLE
                    creep.memory.destination = ''
                }
                break;
            case CREEP_COLLECTING:
                if (ServiceCreeps.collecting(creep)) {
                    creep.memory.state = CREEP_MOVE_TO_DESTINATION
                } else {
                    creep.memory.state = CREEP_IDLE
                    creep.memory.target = ''
                }
                break;
            case CREEP_MOVE_TO_TARGET:
                if (!ServiceCreeps.moveToTarget(creep)) {
                    creep.memory.state = CREEP_COLLECTING
                }
                break;
            case CREEP_MOVE_TO_DESTINATION:
                if (!ServiceCreeps.moveToDestination(creep, 3)) {
                    creep.memory.state = CREEP_BUILDING
                }
                break;
            default:
                if (creep.carry.energy > 0 && creep.memory.destination) {
                    creep.memory.state = CREEP_MOVE_TO_DESTINATION
                } else if (creep.carry.energy === 0 && creep.memory.target) {
                    creep.memory.state = CREEP_MOVE_TO_TARGET
                }
                break;
        }
    }
}

module.exports = new RoleBuilder