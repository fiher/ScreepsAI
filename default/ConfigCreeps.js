let CreepControllerCarrier = require('CreepControllerCarrier')
let CreepControllerUpgrader = require('CreepControllerUpgrader')
let CreepControllerBuilder = require('CreepControllerBuilder')
let CreepControllerAttacker = require('CreepControllerAttacker')
let CreepControllerHarvester = require('CreepControllerHarvester')
let CreepControllerMineralMiner = require('CreepControllerMineralMiner')
let CreepControllerMineralFiller = require('CreepControllerMineralFiller')
let CreepControllerRepairer = require('CreepControllerRepairer')
let RoleMiner = require('RoleMiner')
class ConfigCreeps {
    constructor(){
        this.creepsControllersByRole = {}
    }

    setConfig(){
        this.creepsControllersByRole = {
            [Memory.creepsConf.roles.miner]: RoleMiner,
            [Memory.creepsConf.roles.carrier]: CreepControllerCarrier,
            [Memory.creepsConf.roles.upgrader]: CreepControllerUpgrader,
            [Memory.creepsConf.roles.builder]: CreepControllerBuilder,
            [Memory.creepsConf.roles.attacker]: CreepControllerAttacker,
            [Memory.creepsConf.roles.mineralMiner]:CreepControllerMineralMiner,
            [Memory.creepsConf.roles.mineralFiller]:CreepControllerMineralFiller,
            [Memory.creepsConf.roles.repairer]:CreepControllerRepairer,
        }

        return

        if(!Memory.creepsConf){
            Memory.creepsConf = {}
        }

        if(!Memory.creepsConf.roles){
            Memory.creepsConf.roles = {
                miner: 'Miner',
                carrier: 'Carrier',
                upgrader:'Upgrader',
                builder:'Builder',
                attacker:'Attacker',
                singer:'Singer',
                filler:'Filler',
                mineralMiner:'MineralMiner',
                mineralFiller:'MineralFiller',
                claimer:'Claimer',
                remoteMiner:'RemoteMiner',
                remoteCarrier:'RemoteCarrier',
                remoteRepairer:'RemoteRepairer',
                healer: 'Healer',
                repairer:'Repairer'
            }
        }
    }

    removeDeadCreeps(){
        Object.keys(Memory.creeps).map((creep)=>{
            if(!Game.creeps[creep]){
                delete Memory.creeps[creep]
            }
        })
    }

    getControllerByRole(role){
        return this.creepsControllersByRole[role]
    }
    
}
module.exports = new ConfigCreeps