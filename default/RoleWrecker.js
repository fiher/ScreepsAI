class RoleWrecker {
    constructor() {
        this.name = 'Wrecker'
        this.priority = 7
        this.prespawn = 400
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
        if (room.name === 'E22S35' || room.name === 'E16S38') {
            return 0
        }
        if(Game.flags.attack){
            return 2
        }
        return 0
    }
    getBuild(room) {
        return [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK]
    }
    work(wrecker) {
        if(!Game.flags.attack){
            return
        }
        if (wrecker.pos.roomName !== Game.flags.attack.pos.roomName || wrecker.pos.x === 0 || wrecker.pos.y === 0 || wrecker.pos.y === 49 || wrecker.pos.x === 49) {
            let path = PathFinder.search(wrecker.pos, Game.flags.attack.pos, {
                roomCallback: roomName => {
                    if (['E16S36', 'E15S36', 'E16S35', 'E16S34', 'E16S32', 'E19S32'].includes(roomName)) {
                        return false
                    }
                    let room = Game.rooms[roomName]
                    if (!room) {
                        return
                    }
                    let costs = new PathFinder.CostMatrix;
                    room.find(FIND_STRUCTURES).forEach(function (struct) {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            // Favor roads over plain tiles
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // Can't walk through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });

                    // Avoid creeps in the room
                    room.find(FIND_CREEPS).forEach(function (creep) {
                        costs.set(creep.pos.x, creep.pos.y, 0xff);
                    });

                    return costs;
                }

            }).path
            
            wrecker.moveByPath(path)
            return
        }
        if (wrecker.memory.structure) {
            let structure = Game.getObjectById(wrecker.memory.structure)
            if (!structure) {
                wrecker.memory.structure = ''
            }
            let result = wrecker.dismantle(structure)
            if (result === ERR_NOT_IN_RANGE) {
                wrecker.moveTo(structure)
                return
            }
            if (result !== OK) {
                wrecker.memory.structure = ''
            }
            return
        }
        let structure = wrecker.pos.findInRange(FIND_STRUCTURES, 20).filter(s => s.structureType != STRUCTURE_CONTROLLER)[0]
        if(!structure){
            Game.flags.attack.remove()
        }
        let result = wrecker.dismantle(structure)
        wrecker.memory.structure = structure.id
        if (result === ERR_NOT_IN_RANGE) {
            wrecker.moveTo(structure)
            return
        }
        if (result === OK) {
            return
        }

    }
}

module.exports = new RoleWrecker