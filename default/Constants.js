//SPAWNING ROLE PRIORITY CONSTANTS
global.MAXIMUM_ROLE_PRIORITY = 11 //Usually assigned to Miners and Fillers!
global.ECONOMY_ROLE_PRIORITY = 9 //Usually assigned to economy roles(Upgrader,Carrier,Builder,Repairer)!
global.OFFENSIVE_ROLE_PRIORITY = 8 //Fighting roles are in this category!
global.REMOTE_MINING_ROLE_PRIORITY = 8 //Remotemining Roles only!

//ENERGY MANAGEMENT CONSTANTS
global.MINIMUM_TERMINAL_ENERGY = TERMINAL_CAPACITY * 0.2 //Do not take energy from the terminal if its energy is below this amount!
global.MINIMUM_WITHDRAW_ENERGY = 150 //Do not take dropped resources or energy from containers with energy value less than this amount!
global.MINIMUM_TOWER_ENERGY = TOWER_CAPACITY * 0.6 //If tower energy is below this number it is considered empty
global.CRITICAL_STORAGE_ENERGY = STORAGE_CAPACITY * 0.01 //If energy drops below this number it is considered critical
global.LOW_STORAGE_ENERGY = STORAGE_CAPACITY * 0.2 //This is considered the low bar for how much energy I should have in my storage at all times
global.HIGH_STORAGE_ENERGY = STORAGE_CAPACITY * 0.7 //If energy is bigger than this number then my bot increases spendings


//PROCESSES CONSTANTS
global.HIGH_PROCESS_PRIORITY = 10 // Procceses of high priority such as RoomConfiguration, Spawning
global.MEDIUM_PROCESS_PRIORITY = 6 // Procceses like Terminal management, mineral mining
global.LOW_PROCESS_PRIORITY = 4 // Proccesses like Observer management and so on
global.EMERGENCY_PROCESS_PRIORITY = 15 // Defensive/Offensive proccesses go to this category

//CREEP STATE CONSTANTS
global.CREEP_DELIVERING = 'delivering'
global.CREEP_MINING = 'mining'
global.CREEP_FILLING = 'filling'
global.CREEP_ATTACKING = 'attacking'
global.CREEP_HEALING = 'healing'
global.CREEP_COLLECTING = 'collecting'
global.CREEP_REPAIRING = 'repairing'
global.CREEP_BUILDING = 'building'
global.CREEP_UPGRADING = 'upgrading'
global.CREEP_MOVE_TO_TARGET = 'moveToTarget' // Placeholder constants for different creep roles
global.CREEP_MOVE_TO_DESTINATION = 'moveToDestination' // Placeholder constants for different creep roles
global.CREEP_MOVE_TO_CONTROLLER = 'moveToController'
global.CREEP_IDLE = 'idle'

// STRUCTURE CUSTUM CONSTANTS
global.STRUCTURE_EXTENSIONS = STRUCTURE_EXTENSION + 's'
global.STRUCTURE_TOWERS = STRUCTURE_TOWER + 's'
global.STRUCTURE_CONTAINERS = STRUCTURE_CONTAINER + 's'
global.STRUCTURE_ROADS = STRUCTURE_ROAD + 's'
global.STRUCTURE_LABS = STRUCTURE_LAB + 's'
global.STRUCTURE_LINKS = STRUCTURE_LINK + 's'
global.STRUCTURE_RAMPARTS = STRUCTURE_RAMPART + 's'