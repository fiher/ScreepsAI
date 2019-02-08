class RoleMineralMiner {
    constructor() {
        this.name = 'MineralMiner'
        this.priority = 6
        this.prespawn = 40
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
        if (room.controller.level < 6) {
            return false
        }
        if (room.energyCapacityAvailable < 1600) {
            return false
        }
        return [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE]
    }
    work(mineralMiner) {
        if (mineralMiner.memory.mining) {
            mineralMiner.harvest(Game.getObjectById(mineralMiner.memory.target))
            return
        }
        if (mineralMiner.memory.container) {
            let container = Game.getObjectById(mineralMiner.memory.container)
            if (container && !mineralMiner.pos.isEqualTo(container.pos.x, container.pos.y)) {
                mineralMiner.moveTo(container)
                return
            }
        }else{
            let container = target.pos.findInRange(FIND_STRUCTURES, 1, {
                                filter: structure => structure.structureType === STRUCTURE_CONTAINER
                            })[0]
            if (container) {
                Memory.ownedRooms[creep.memory.owner].minerals[target.id].container = container.id
                creep.memory.container = container.id
                return
            }
        }
        let mineral = Game.getObjectById(mineralMiner.memory.target)
        let result = mineralMiner.harvest(mineral)
        if (result === ERR_NOT_IN_RANGE) {
            mineralMiner.moveTo(mineral, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                },
                range: 1
            })
            return
        } else if (result === OK) {
            mineralMiner.memory.mining = true
        }
    }
}
module.exports = new RoleMineralMiner