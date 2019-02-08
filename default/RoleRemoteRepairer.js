class RoleRemoteRepairer {
    constructor() {
        this.name = 'RemoteRepairer'
        this.priority = 7
        this.prespawn = 50
    }
    getName() {
        return this.name
    }
    getPriority() {
        return this.priority
    }
    getPrespawn() {
        return this.prespawn
    }
    work(remoteRepairer) {
        if (!remoteRepairer.memory.targetRoom) {
            return
        }
    }
    moveToRoom(remoteRepairer) {
        if (remoteRepairer.memory.targetRoom === remoteRepairer.pos.roomName && remoteRepairer.pos.x !== 49 && remoteRepairer.pos.y !== 49 && remoteRepairer.pos.x !== 0 && remoteRepairer.pos.x !== 0) {
            remoteRepairer.memory.state = CREEP_MOVE_TO_TARGET
            return
        }
        remoteRepairer.moveTo(new RoomPosition(25, 25, remoteRepairer.memory.targetRoom))
    }
    moveToTarget(remoteRepairer) {

    }
    moveToDestination(remoteRepairer) {

    }
    collect(remoteRepairer) {
        let destination = Game.getObjectById(remoteRepairer.memory.destination)
        if (destination.structureType) {
            remoteRepairer.withdraw(destination, RESOURCE_ENERGY)
        } else {
            remoteRepairer.pickup(destination)
        }
        remoteRepairer.memory.state = CREEP_MOVE_TO_TARGET
    }
    repair(remoteRepairer) {
        let outcome = remoteRepairer.repair(Game.getObjectById(remoteRepairer.memory.target))
        if (outcome != OK) {
            remoteRepairer.memory.target = ''
            remoteRepairer.memory.state = CREEP_MOVE_TO_DESTINATION
        }

    }
}
module.exports = new RoleRemoteRepairer