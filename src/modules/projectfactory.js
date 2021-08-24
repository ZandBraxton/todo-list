export default class projectFactory {
    constructor({name, desc}) {
        this.name = name
        this.list = []
        this.desc = desc
    }

    getName() {
        return this.name
    }

    getList() {
        return this.list
    }

    changeName(name) {
        this.name = name
    }
}