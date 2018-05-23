class ControllerTerminal {
    constructor(){
        
    }
    main(room){
        if(!room.terminal){
            return
        }
        let roomMineral = room.mineral.mineralType
        let terminal = room.terminal
        let reserves = terminal.store.roomMineral
        if(reserves < 100000){
            return
        }
    }
}
module.exports = new ControllerTerminal