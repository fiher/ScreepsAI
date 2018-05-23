let RepositoryEnergySources = require('RepositoryEnergySources')
class RoleCarrier {
    constructor(){
        this.name = 'Carrier'
        this.priority = 9
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        let linksMineCount = RepositoryEnergySources.getLinksMineCount(room.name)
        if(!Game.rooms[room.name].storage && !linksMineCount){
            return 3
        }
        if(Game.rooms[room.name].storage && linksMineCount){
            return 3 - linksMineCount
        }
        return 3
    }
    getBuild(room){
        if(room.emergency){
            return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
        }
        let build = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
        let capacity = room.energyCapacityAvailable
        switch(true){
            case (capacity >=900):
                build = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
                break
            case (capacity >= 450):
                build = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
                break
            default:
                build = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
                break
        }
        return build
    }
}

module.exports = new RoleCarrier