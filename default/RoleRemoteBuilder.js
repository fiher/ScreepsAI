class RoleRemoteBuilder {
    constructor() {
        this.name = 'RemoteBuilder'
        this.priority = 7
        this.prespawn = 40
    }
    getName() {
        return this.name
    }
    getPrespawn() {
        return this.prespawn
    }
    getPriority() {
        return this.priority
    }
    getBuild(room) {
        return [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    }
    getMaximum(room) {
        let constructionSites = []
        Object.values(Memory.remoteRooms).forEach(remote => {
            remote.constructionSites.forEach(site => constructionSites.push(site))
        })
        let constructionSites = room.constructionSites ? Object.values(room.constructionSites) : []
        if (constructionSites.length === 0) {
            return 0
        }
        let totalCost = 0
        constructionSites.map(site => Game.getObjectById(site.id)).filter(site => site).forEach(site => totalCost += site.progressTotal)
        if (Game.cpu.bucket < 5000) {
            return 1
        }
        if (totalCost < 10000) {
            return 1
        } else if (totalCost < 50000) {
            return 2
        } else {
            return 3
        }
    }
    work(remoteBuilder) {

    }
    build(remoteBuilder) {
        if (remoteBuilder.repair(Game.getObjectById(remoteBuilder.memory.target)) === ERR_NOT_ENOUGH_RESOURCES) {
            remoteBuilder.memory.state = 'moveToDestination'
        }
    }
    collect(remoteBuilder) {
        destination = Game.getObjectById(remoteBuilder.memory.destination)
        if (destination.structureType) {
            remoteBuilder.withdraw(destination, RESOURCE_ENERGY)
            return
        } else {
            operationResult = remoteBuilder.pickup(destination)
        }
        if (remoteBuilder.carry.energy === remoteBuilder.carryCapacity) {
            remoteBuilder.memory.state = 'moveToTarget'
            return
        }
    }
    moveToDestination(remoteBuilder) {

    }
    moveToTarget(remoteBuilder) {

    }
    moveToRoom(remoteRepairer) {
        remoteRepairer.moveTo(new RoomPosition(25, 25, remoteRepairer.memory.targetRoom))
    }
}

module.exports = new RoleRemoteBuilder