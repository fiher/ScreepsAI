class ControllerTower {
    main(room) {
        room[STRUCTURE_TOWERS].forEach(tower => {
            room[STRUCTURE_RAMPARTS].filter(rampart => rampart).forEach(rampart => {
                if (rampart.hits < 1000) {
                    tower.repair(rampart)
                }
            })
        })

    }
}
module.exports = new ControllerTower