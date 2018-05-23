class RoleMineralFiller {
    constructor(){
        this.name = 'MineralFiller'
        this.priority = 6
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        if(room.level < 6 || !room.terminal){
            return 0
        }
        let amount  = Game.rooms[room.name].find(FIND_MINERALS)[0].mineralAmount
        if(amount === 0){
            return 0 
        }
        return 1
    }
    getBuild(room){
        if(room.level < 6){
            return false
        }
        
        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
    }
}
module.exports = new RoleMineralFiller