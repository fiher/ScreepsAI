class ConfigMarket {
    constructor(){
        if(Memory.market){return}
        
        Memory.market = {
            resources: {
                
            }
        }
    }
    init(){
        return
        let orders = Object.values(Game.market.orders)
        orders.forEach(order => {
            if(!order.active){
                Game.market.cancelOrder(order.id)
            }
        })
        const rooms = Object.values(Game.rooms).filter( room => room.terminal)
        rooms.forEach(room => {
            const terminal = room.terminal
            const resources = Object.keys(terminal.store)
            resources.forEach(resource => {
                if(!Memory.market){
                    Memory.market = {
                        resources: {
                            
                        }
                    }
                }
                if(!Memory.market.resources[resource]){
                    Memory.market.resources[resource] = {
                       rooms: []
                    }
                }
                const addRoom = {amount: terminal.store[resource], name: room.name}
                Memory.market.resources[resource].rooms.push(addRoom)
        })
    })
    }
    
}

module.exports = new ConfigMarket