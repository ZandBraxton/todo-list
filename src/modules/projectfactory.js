export default class projectFactory {
    constructor({name}) {
        this.name = name
        this.list = []
    }

    getName() {
        return this.name
    }

    getList() {
        return this.list
    }
}