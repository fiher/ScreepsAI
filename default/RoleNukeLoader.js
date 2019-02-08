class RoleNukeLoader {
    constructor() {
        this.name = 'NukeLoader'
        this.priority = 6
        this.prespawn = 50
    }
    getPriority(room) {
        return this.priority
    }
    getPrespawn() {
        return this.prespawn
    }
    getName() {
        return this.name
    }
    getMaximum(room) {
        if (room.level < 8) {
            return 0
        }
        room = Game.rooms[room.name]
        if (!room.terminal || !room.nuker) {
            return 0
        }
        if (room.nuker.ghodium === room.nuker.ghodiumCapacity || !room.terminal.store[RESOURCE_GHODIUM]) {

            return 0
        }
        return 2
    }
    getBuild(room) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    }
    work(creep) {
        if (creep.memory.filling) {
            let nuker = Game.rooms[creep.memory.owner].nuker
            let outcome = creep.transfer(nuker, RESOURCE_GHODIUM)
            if (outcome === ERR_NOT_IN_RANGE) {
                creep.moveTo(nuker)
            }
            if (creep.carry === 0) {
                creep.memory.filling = false
            }
            return
        }
        let terminal = Game.rooms[creep.memory.owner].terminal
        let outcome = creep.withdraw(terminal, RESOURCE_GHODIUM)
        if (outcome === ERR_NOT_IN_RANGE) {
            creep.moveTo(terminal)
        }
    }
}
module.exports = new RoleNukeLoader