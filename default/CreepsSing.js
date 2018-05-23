class CreepsSing {
    rickRolled(){
        function compare(a,b) {
            if (a.ticksToLive === b.ticksToLive){
                return 0
            }else{
                return a.ticksToLive < b.ticksToLive ? -1:1
            }
        }
        let creeps = Object.values(Game.creeps)
                        .filter(creep => creep.memory.role === 'Singer')
                        .sort(compare)
        let song = [
            'CYBER ANTS!!! CYBER ANTS!!!','CYBER ANTS!!! CYBER ANTS!!!','What are you going to do...','When they come for you?'
        ]  
        let songs = ["Buddy you are a boy make a big noise",
                    "Playin' in the street",
                    "gonna be a big man some day",
                    "You got mud on yo' face",
                    "You big disgrace",
                    "Kickin' your can all over the place",
                    "Singin'",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "Buddy you're a young man hard man",
                    "Shoutin' in the street",
                    "gonna take on the world some day",
                    "You got blood on yo' face",
                    "You big disgrace",
                    "Wavin' your banner all over the place",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "Sing it!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "Buddy you're an old man poor man",
                    "Pleadin' with your eyes",
                    "gonna make you some peace some day",
                    "You got mud on your face",
                    "Big disgrace",
                    "Somebody better put you back into your place",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "Sing it!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "Everybody",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "W E W I L L","","W E W I L L","","R O C K YOU !!!",
                    "(Alright)"]
        let flag = Game.flags.helloFlag
        if(!flag){
            return
        }
        let sentence = song[Game.time % song.length]
        let words = sentence.split(' ')
        if(words.length > creeps.length){
            for(let k = 0;k<words.length;k++){
                if((words[k] + ' ' + words[k+1]).length < 10){
                    words[k] = words[k] + ' ' + words[k+1]
                    words.splice(k+1,1)
                    k--
                }
            }
        }
        if(words.length < creeps.length){
            let counter = 1
            while(words.length < creeps.length){
                if(counter % 2 === 0){
                    words.push('*dum*')
                }else{
                    words.push('*tss*')
                }
                counter++
            }
        }
        for(let i = 0; i < creeps.length;i++){
            let creep = creeps[i]
            if(creep.pos.roomName === flag.pos.roomName){
                let x = flag.pos.x + i * 3
                let y = flag.pos.y
                let roomName = flag.pos.roomName
                if(!creep.pos.isEqualTo(x,y)){
                    let result = creep.moveTo(new RoomPosition(x, y,roomName),{reusePath:0,ignoreCreeps:false})
                    //console.log(`${x} ${y} ${roomName}`)
                    //console.log(result)
                }
                
                let say = words[i]
                if(!say){ say = '*dumm*'}
                creep.say(say,true)
            }else{
                let result = creep.moveTo(flag)
                //console.log(result + ' move to flag')
            }
        }
    }
}
let song = [
    'CYBER ANTS!!! CYBER ANTS!!!','CYBER ANTS!!! CYBER ANTS!!!','What are you going to do...','When they come for you?'
    ]
module.exports = new CreepsSing