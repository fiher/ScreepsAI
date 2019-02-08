class RoleRemoteCarrier {
    constructor() {
        this.name = 'RemoteCarrier'
        this.priority = 7
        this.prespawn = 50
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
    getMaximum(room) {
        return 0
    }
    getBuild(room) {
        let build = []
        switch (true) {
            case (room.energyCapacityAvailable > 1800):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 1000):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 600):
                build = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
                break
            default:
                build = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
        }
        return build
    }
}

module.exports = RoleRemoteCarrier