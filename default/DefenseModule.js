class DefenseModule {
    constructor(){
        
    }
    main(room){
        room = Memory.ownedRooms[room.name]
        let gameRoom = Game.rooms[room.name] //this is needed because the parameter passed is `Memory.ownedRooms`
        let hostileCreeps = gameRoom.find(FIND_HOSTILE_CREEPS).filter(creep => creep.getActiveBodyparts(ATTACK) 
                                                        || creep.getActiveBodyparts(RANGED_ATTACK) 
                                                        || creep.getActiveBodyparts(WORK)
                                                        || creep.getActiveBodyparts(CLAIM))
        if(hostileCreeps.length < 1){
            room.underAttack = false
            room.threatLevel = 0
            return
        }
        room.underAttack = true
        if(!room.threatLevel){
            this.underAttack = true
            this.defineThreatLevel(room,hostileCreeps)
        }
        this.shoot(room,hostileCreeps)
    }
    defineThreatLevel(room,hostileCreeps){
        let owners = {}
        hostileCreeps.forEach(hostile => {
            if(!owners[hostile.owner.username]){
                owners[hostile.owner.username] = hostile.owner.username
            }
        })
        let ownersLength = Object.keys(owners).length
        if(ownersLength === 1 && owners['Invader']){
          room.threatLevel = 1
          return
        }
        room.threatLevel += ownersLength
        if(owners['Tigga']){
          room.threatLevel = 100
        }
    }
    shoot(room,hostileCreeps){
        let towers = Object.values(room.towers).map(tower => Game.getObjectById(tower.id))
        let result = _(towers)
        .zip(_(hostileCreeps).shuffle().value())
        .forEach(t => {
            !_.some(t, x => !x)
            &&
            //zip returns an array of arrays as pairs which ends up like [tower,target] so by saying t[0] we get the tower and t[1] is the target
            t[0].attack(t[1])
        })
        console.log(result)
    }
}

module.exports = new DefenseModule