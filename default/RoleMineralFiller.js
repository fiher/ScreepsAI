class RoleMineralFiller {
    constructor() {
        this.name = 'MineralFiller'
        this.priority = 6
        this.prespawn = 10
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
        const terminal = Game.rooms[room.name].terminal
        if (room.level < 6 || !terminal) {
            return 0
        }
        let amount = Game.rooms[room.name].find(FIND_MINERALS)[0].mineralAmount
        if (amount === 0) {
            return 0
        }
        if(terminal && _.sum(terminal.store) === 300000){
            return 0
        }
        return 1
    }
    getBuild(room) {
        if (room.level < 6) {
            return false
        }

        return [CARRY, CARRY, MOVE]
    }
}
module.exports = new RoleMineralFiller