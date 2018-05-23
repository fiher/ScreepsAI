class RoleUpgrader {
    constructor(){
        this.name = 'Upgrader'
        this.priority = 8
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        if(room.underAttack){
            return 1
        }
        if(room.level === 8){
            return 1
        }
        if(room.level <= 3 ){
            return 4
        }
        if(room.level >=4 && Game.rooms[room.name].storage){
            if(Game.rooms[room.name].storage.store.energy < 200000){
                return 1
            }
            return 2
        }
        return 2
    }
    getBuild(room){
        let capacity = room.energyCapacityAvailable
        
        let build = [CARRY,CARRY,CARRY,WORK,MOVE]
        switch(true){
            case (450 < capacity && capacity < 700):
                build = [WORK,WORK,WORK,CARRY,CARRY,MOVE]
                break;
            case (700 <= capacity && capacity < 1200):
                build = [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]
                break;
            case (1200 <= capacity && capacity <= 2400):
                build = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE]
                break;
            case (2400 < capacity):
                build = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
                break;
        }
        return build
    }
}

module.exports = new RoleUpgrader