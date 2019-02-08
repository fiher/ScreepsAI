class RoleReserver {
    constructor() {
        this.name = 'Reserver'
        this.priority = 7
        this.prespawn = 30
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
        let build = [CLAIM, CLAIM, MOVE, MOVE]

        return build
    }
    getMaximum(room) {
        return 0
        if (room.level < 5) {
            return 0
        }
        return Object.values(Memory.remoteRooms).map(remoteRoom => remoteRoom.owner).filter(owner => owner === room.name).length
    }
    work(reserver) {

        if (!reserver.memory.targetRoom) {
            return
        }

        if (!reserver.memory.state) {
            reserver.memory.state = 'moveToTarget'
        }

        switch (reserver.memory.state) {
            case 'moveToTarget':
                this.moveToTarget(reserver)
                break
            case 'reserve':
                this.reserve(reserver)
                break
            default:
                this.moveToTarget(reserver)
        }
    }
    reserve(reserver) {
        reserver.reserveController(Game.getObjectById(reserver.memory.target))
    }
    moveToTarget(reserver) {
        let controller = Game.getObjectById(reserver.memory.target)
        if (controller && !reserver.pos.isNearTo(controller) && ((reserver.pos.x !== 49 && reserver.pos.x !== 0) || (reserver.pos.y !== 49 && reserver.pos.y !== 0))) {
            reserver.moveTo(controller)
            return
        }
        if ((!controller && reserver.memory.target) || (reserver.pos.x === 49 || reserver.pos.x === 0 || reserver.pos.y === 49 || reserver.pos.y === 0)) {
            reserver.moveTo(new RoomPosition(25, 25, reserver.memory.targetRoom))
            return
        }
        reserver.memory.state = 'reserve'
    }
}

module.exports = new RoleReserver