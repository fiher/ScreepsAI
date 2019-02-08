const RepositoryCreeps = require('RepositoryCreeps')
class ControllerSpawns {
    manage(spawn) {
        this.spawnCreep(spawn)
    }
    spawnCreep(spawn) {
        function reducer(prevRole, nextRole) {
            let prevRolePriority = 0
            if (prevRole !== 0) {
                prevRolePriority = RepositoryCreeps.calculatePriority(spawn.room.name, prevRole)
            }
            let nextRolePriority = RepositoryCreeps.calculatePriority(spawn.room.name, nextRole)
            if (prevRolePriority === 0 && nextRolePriority === 0) {
                return 0
            }
            return prevRolePriority > nextRolePriority ? prevRole : nextRole
        }
        let creepRole = RepositoryCreeps.getRoles().reduce(reducer)

        if (creepRole === 0) {
            //logger `No need for new creeps. Room is ${spawn.room.name}`
        } else {
            const build = RepositoryCreeps.getCreepsBuild(Memory.ownedRooms[spawn.room.name], creepRole)
            const name = (creepRole + (+new Date)).toString(36) //this creates hash from current time + some random number
            const buildResult = spawn.spawnCreep(build, name, {
                memory: {
                    role: creepRole,
                    owner: spawn.room.name
                }
            })
            if (buildResult !== OK) {
                console.log("Build unsuccessful -> " + buildResult)
                console.log("Creep role =>" + creepRole)
                console.log("With build ->" + JSON.stringify(build))
                console.log("Room is ->" + spawn.room.name)
            }
        }

    }
}

module.exports = new ControllerSpawns