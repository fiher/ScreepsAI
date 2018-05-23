let ConfigCreeps = require('ConfigCreeps')
let ConfigRooms = require('ConfigRooms')
let ControllerRooms = require('ControllerRooms')
let profiler = require('screeps-profiler')
let RepositoryEnergySources = require('RepositoryEnergySources')
profiler.enable()
module.exports.loop = function () {

    profiler.wrap(function() {
        ConfigCreeps.setConfig()
        Object.values(Memory.rooms).forEach(room => ControllerRooms.manage(room))
        if(Game.time % 11 === 0){
            if(Memory.creeps && Object.values(Memory.creeps).length !== Object.values(Game.creeps).length){
                ConfigCreeps.removeDeadCreeps()
                ConfigRooms.removeDeadCreeps()
            }
        }
        if(Game.time % 100 === 0 ){
            ConfigRooms.init()
        }
        Object.values(Game.creeps).filter(creep => !creep.spawning).map((creep)=>{
            let controller = ConfigCreeps.getControllerByRole(creep.memory.role)
            if(controller){
                let start = Game.cpu.getUsed()
                controller.work(creep)
                let used = Game.cpu.getUsed() - start
                new RoomVisual(creep.pos.roomName).text(used.toFixed(3)+' cpu',creep.pos.x,creep.pos.y+1,{color: 'yellow',stroke:2, font: 1.0})
            }
        })
        Memory.cpu.total += Game.cpu.getUsed()
        if(Game.time % 1500 === 0){
            Memory.cpu.average = Memory.cpu.total / 1500.00
            Memory.cpu.bigTotal += Memory.cpu.total
            Memory.cpu.total = 0
        }
        if(Game.time % 15000 === 0){
            Memory.cpu.bigAverage = Memory.cpu.bigTotal / 15000.00
            Memory.cpu.bigTotal = 0
        }
    })
}