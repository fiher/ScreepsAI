const ControllerRooms = require('ControllerRooms')
const ControllerCreeps = require('ControllerCreeps')
const profiler = require('screeps-profiler')
const Logger = require('logger')
require('Constants')

module.exports.loop = function () {
    ControllerRooms.main()
    ControllerCreeps.main()
    Logger.cpu()
}