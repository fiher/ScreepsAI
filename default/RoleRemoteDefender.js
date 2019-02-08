class RoleRemoteDefender {
    constructor() {
        this.name = 'RemoteDefender'
        this.priority = 7
        this.prespawn = 20
    }
    getName() {
        return this.name
    }
    getPriority() {
        return this.priority
    }
    getPrespawn() {
        return this.prespawn
    }
}
module.exports = new RoleRemoteDefender