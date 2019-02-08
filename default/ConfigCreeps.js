const CreepControllerUpgrader = require('CreepControllerUpgrader')
const CreepControllerMineralFiller = require('CreepControllerMineralFiller')
const RoleMiner = require('RoleMiner')
const RoleMineralMiner = require('RoleMineralMiner')
const RoleRepairer = require('RoleRepairer')
const RoleReserver = require('RoleReserver')
const RoleFiller = require('RoleFiller')
const RoleRemoteMiner = require('RoleRemoteMiner')
const RoleDefender = require('RoleDefender')
const RoleWrecker = require('RoleWrecker')
const RoleCarrier = require('RoleCarrier')
const RoleMineralFiller = require('RoleMineralFiller')
const RoleUpgrader = require('RoleUpgrader')
const RoleBuilder = require('RoleBuilder')
const RoleNukeLoader = require('RoleNukeLoader')
const RoleClaimBuilder = require('RoleClaimBuilder')
const RoleClaimer = require('RoleClaimer')
class ConfigCreeps {
    constructor() {
        this.creepsControllersByRole = {
            [RoleMiner.getName()]: RoleMiner,
            [RoleCarrier.getName()]: RoleCarrier,
            [RoleUpgrader.getName()]: CreepControllerUpgrader,
            [RoleBuilder.getName()]: RoleBuilder,
            [RoleMineralMiner.getName()]: RoleMineralMiner,
            [RoleMineralFiller.getName()]: CreepControllerMineralFiller,
            [RoleRepairer.getName()]: RoleRepairer,
            [RoleReserver.getName()]: RoleReserver,
            [RoleRemoteMiner.getName()]: RoleRemoteMiner,
            [RoleDefender.getName()]: RoleDefender,
            [RoleWrecker.getName()]: RoleWrecker,
            [RoleMineralMiner.getName()]: RoleMineralMiner,
            [RoleNukeLoader.getName]: RoleNukeLoader,
            [RoleClaimBuilder.getName()]: RoleClaimBuilder,
            [RoleClaimer.getName()]: RoleClaimer,
        }
    }
    removeDeadCreeps() {
        Object.keys(Memory.creeps).map((creep) => {
            if (!Game.creeps[creep]) {
                delete Memory.creeps[creep]
            }
        })
    }
    getControllerByRole(role) {
        return this.creepsControllersByRole[role]
    }

}
module.exports = new ConfigCreeps