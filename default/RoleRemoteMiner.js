class RoleRemoteMiner {
    constructor() {
        this.name = 'RemoteMiner'
        this.priority = 7
        this.prespawn = 100
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
    getMaximum(room) {
        return 0
        if (room.level < 5) {
            return 0
        }
        let sources = []
        Object.values(Memory.remoteRooms).filter(remote => remote.owner === room.name).forEach(remote => {
            Object.values(remote.sources).forEach(source => {
                sources.push(source)
            })
        })
        let build = this.getBuild(room)
        if (!build) {
            return 0
        }
        let buildWorkParts = build.filter(part => part === WORK).length
        let workPartsNeeded = (sources.length * SOURCE_ENERGY_CAPACITY) / (HARVEST_POWER * ENERGY_REGEN_TIME)
        let maximumMiners = 0
        sources.forEach(source => maximumMiners += source.maxCreepsCount)
        let minersNeeded = Math.ceil(workPartsNeeded / buildWorkParts)

        return minersNeeded > maximumMiners ? maximumMiners : minersNeeded
    }
    getBuild(room) {
        let build = []
        switch (true) {
            case (room.energyCapacityAvailable > 1500):
                build = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 1000):
                build = [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]
                break
            case (room.energyCapacityAvailable > 600):
                build = [WORK, WORK, WORK, MOVE, MOVE, MOVE]
                break
            default:
                build = [WORK, WORK, MOVE, MOVE]
                break
        }
        return build
    }
    work(remoteMiner) {
        if (!remoteMiner.memory.targetRoom) {
            return
        }
        switch (remoteMiner.memory.state) {
            case CREEP_HARVESTING:
                this.harvest(remoteMiner)
                break
            case CREEP_MOVE_TO_TARGET:
                this.moveToTarget(remoteMiner)
                break
            default:
                this.moveToTarget(remoteMiner)
                break
        }
    }
    moveToTarget(remoteMiner) {
        let source = Game.getObjectById(remoteMiner.memory.target)
        if (source && !remoteMiner.pos.isNearTo(source) && ((remoteMiner.pos.x !== 49 && remoteMiner.pos.x !== 0) || (remoteMiner.pos.y !== 49 && remoteMiner.pos.y !== 0))) {
            remoteMiner.moveTo(source)
            return
        }
        if ((!source && remoteMiner.memory.target) || (remoteMiner.pos.x === 49 || remoteMiner.pos.x === 0 || remoteMiner.pos.y === 49 || remoteMiner.pos.y === 0)) {
            remoteMiner.moveTo(new RoomPosition(25, 25, remoteMiner.memory.targetRoom))
            return
        }
        remoteMiner.memory.state = CREEP_HARVESTING
    }
    moveToRoom(remoteMiner) {

    }
    harvest(remoteMiner) {
        remoteMiner.harvest(Game.getObjectById(remoteMiner.memory.target))
    }
}
module.exports = new RoleRemoteMiner