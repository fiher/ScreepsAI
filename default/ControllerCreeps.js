const ConfigCreeps = require('ConfigCreeps')
const ConfigRooms = require('ConfigRooms')
const Logger = require('logger')

class ControllerCreep {
    main(){
        Object.values(Game.creeps).filter(creep => !creep.spawning).map((creep) => {
            const controller = ConfigCreeps.getControllerByRole(creep.memory.role)
            if (controller) {
                const start = Game.cpu.getUsed()
                controller.work(creep)
                const used = Game.cpu.getUsed() - start
                Logger.roleCPU(creep, used)
            }
        })
        if (Game.time % 10 === 0) {
            if (Memory.creeps && Object.values(Memory.creeps).length !== Object.values(Game.creeps).length) {
                ConfigCreeps.removeDeadCreeps()
            }
            ConfigRooms.removeDeadCreeps()
        }
    }
}

module.exports = new ControllerCreep