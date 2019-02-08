const RepositoryCreeps = require('RepositoryCreeps')
const RoleCarrier = require('RoleCarrier')

class ServiceRooms {
    roomLayout(room){
        
    }
    isEmergency(room){
        const carriersCount = RepositoryCreeps.getCreepsCountByRole(room, RoleCarrier.getName())
        const creepsInRoom = RepositoryCreeps.getCreepsInRoom(room).length
        if( carriersCount < 1 && creepsInRoom < 3){
            room.emergency = true
        }else{
            room.emergency = false
        }
        
    }
}

module.exports = new ServiceRooms