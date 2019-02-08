let RepositoryCreeps = require('RepositoryCreeps')
class Logger {
    constructor() {
        if (!Memory.cpu) {
            Memory.cpu = {
                average: 0,
                total: 0,
                bigTotal: 0,
                perRole: {}
            }
        }
    }
    cpu() {
        Memory.cpu.total += Game.cpu.getUsed()
        if (Game.time % 1500 === 0) {
            Memory.cpu.average = Memory.cpu.total / 1500.00
            Memory.cpu.bigTotal += Memory.cpu.total
            Memory.cpu.total = 0
        }
        if (Game.time % 15000 === 0) {
            Memory.cpu.bigAverage = Memory.cpu.bigTotal / 15000.00
            Memory.cpu.bigTotal = 0
        }
    }
    roleCPU(creep, usedCPU) {
        if (!Memory.cpu.perRole[creep.memory.role]) {
            Memory.cpu.perRole[creep.memory.role] = {}
        }
        let role = Memory.cpu.perRole[creep.memory.role]
        role.total += usedCPU
        if (Game.time % 1500 === 0) {
            role.average = role.total / 1500.00
            role.bigTotal += role.total
            role.total = 0
        }
        if (Game.time % 15000 === 0) {
            role.bigAverage = role.bigTotal / 15000.00
            role.bigTotal = 0
        }
    }
}

module.exports = new Logger