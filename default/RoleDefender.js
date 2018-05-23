class RoleDefender {
    constructor(){
        this.name = 'Defender'
        this.priority = 7
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        return 0 + room.threatLevel-1
    }
    getBuild(room){
        return [RANGED_ATTACK,ATTACK,MOVE]
    }
}

module.exports = new RoleDefender