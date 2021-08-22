import format from "date-fns/format"

export default class taskFactory {
    constructor({name, dueDate, priority, bool}) {
        this.name = name
        //converts date to correct time
        const utcDate = new Date(dueDate)
        const utcDateOnly = new Date(utcDate.valueOf() + utcDate.getTimezoneOffset() * 60 * 1000)
        const date = format(new Date(utcDateOnly), 'MM/dd/yyyy')
        this.dueDate = date
        this.priority = priority
        this.bool = bool
    }
    
    getName() {
        return this.name
    }

    getDate() {
        return this.dueDate
    }

    reName(name) {
        this.name = name
    }
    
    complete() {
        if (this.bool === false) {
            this.bool = true
        } else {
            this.bool = false
        }


    }
}