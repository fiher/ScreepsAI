class ControllerTerminal {
    constructor() {

    }
    
    main(room) {
        const terminal = Game.rooms[room.name].terminal
        if(Game.market.credits < 240000){
            return
        }
        if (!terminal) {
            return
        }
        const roomMineral = Object.values(room.minerals)[0].type
        const reserves = terminal.store[roomMineral]
        if (reserves < 100000) {
            return
        }
        const orders = Object.values(Game.market.orders)
                                    .filter(order => order.active && order.roomName === room.name && order.resourceType === roomMineral)
                                    .map(order => order.remainingAmount)
        const ordersAmount = orders.length > 0 ? orders.reduce((a,b) => a+b,0) : 0
        const remaining = reserves - ordersAmount
        if(remaining <= 10000){return}
        Game.market.createOrder(ORDER_SELL,roomMineral, 0.250, remaining - 10000, room.name)
    }
}
module.exports = new ControllerTerminal