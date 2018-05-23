class RoleFiller {
    constructor(){
        this.name = 'Filler'
        this.priority = 8
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        if(!Object.values(room.extensions).length || !Object.values(room.containers).length){return 0}
        if(room.underAttack && room.threatLevel > 1){ return 3}
        return 1
    }
    getBuild(room){
        let build = []
        switch(true){
            case (room.energyCapacityAvailable > 2000):
                build = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
                break
            case (room.energyCapacityAvailable > 1000):
                build = [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
                break
            default:
                build = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
                break
        }
        
        return build
    }
}

module.exports = new RoleFiller