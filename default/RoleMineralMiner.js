class RoleMineralMiner {
    constructor(){
        this.name = 'MineralMiner'
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
        if(room.controller.level < 6){
            return false
        }
        if(room.energyCapacityAvailable < 1000){
            return false
        }
        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE]
    }
}
module.exports = new RoleMineralMiner