//let ServiceCreeps = require('ServiceCreeps')
class RoleClaimer {
    constructor(){
        this.name = 'Claimer'
        this.priority = 6
        this.prespawn = 100
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getPrespawn(){
        return this.prespawn
    }
    getMaximum(room){
        if( Object.keys(Game.flags).filter(flag => flag.includes(room.name) && flag.includes('claim')).length > 0 ){
            return 1
        }
        return 0
    }
    getBuild(room){
        return [CLAIM,MOVE,MOVE]
    }
    work(claimer){
        if(!Game.flags['claim'+claimer.memory.owner]){return}
        if(!claimer.pos.isNearTo(Game.flags['claim'+claimer.memory.onwer]) && (claimer.pos.roomName !== Game.flags['claim' + claimer.memory.owner].pos.roomName || claimer.pos.x !== 49 && claimer.pos.x !== 0)){
            claimer.moveTo(Game.flags['claim' + claimer.memory.owner])
            return
        }
        if(!claimer.pos.isNearTo(claimer.room.controller)){
            claimer.moveTo(claimer.room.controler)
            return
        }
        let outcome = claimer.claimController(claimer.room.controller)
        if(outcome === OK){
            Game.flags['claim'+  claimer.memory.owner].remove()
            claimer.pos.createFlag('build' + claimer.memory.owner)
        }
        return
        
    }
}
module.exports = new RoleClaimer