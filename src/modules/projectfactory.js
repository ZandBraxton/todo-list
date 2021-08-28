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

    pushTask(task) {
        this.list.push(task)
    }

    changeName(name) {
        this.name = name
    }
    changeDesc(desc) {
        this.desc = desc
    }
}