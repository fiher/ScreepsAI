class RoleBuilder {
    constructor(){
        this.name = 'Builder'
        this.priority = 7
    }
    getPriority(room){
        return this.priority
    }
    getName(){
        return this.name
    }
    getMaximum(room){
        let constructionSites = room.constructionSites ? Object.values(room.constructionSites) : []
        //let constructionSites = Object.values(room.constructionSites)
       
        if(constructionSites.length ===0){
            return 0
        }
        let totalCost = 0
        constructionSites.map(site => Game.getObjectById(site.id)).filter(site => site).forEach(site => totalCost += site.progressTotal)
        
        if(totalCost < 10000){
            return 1
        }else if(totalCost < 50000){
            return 2
        }else{
            return 3
        }
    }
    getBuild(room){
     return [CARRY,CARRY,CARRY,WORK,MOVE]   
    }
}

module.exports = new RoleBuilder