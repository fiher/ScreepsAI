let RepositoryStructures = require('RepositoryStructures')

class ControllerLinks {
    constructor() {

    }
    main(roomName) {
        let linksMine = RepositoryStructures.getLinksMine(roomName).filter(link => link).filter(linkMine => linkMine.energy > linkMine.energyCapacity - 300)
        let links = RepositoryStructures.getLinksAll(roomName)
        if (!linksMine) {
            return
        }
        linksMine.forEach(linkMine => {
            let link = links.filter(link => link.energyCapacity - link.energy <= linkMine.energy)[0]
            if (link) {
                linkMine.transferEnergy(link)
                links.shift()
            }
        })
    }
}
module.exports = new ControllerLinks