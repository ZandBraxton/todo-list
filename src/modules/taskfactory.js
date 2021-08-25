import format from "date-fns/format"

export default class taskFactory {
    constructor({name, dueDate, priority, bool, project, notes}) {
        this.name = name
        //converts date to correct time
        const utcDate = new Date(dueDate)
        const utcDateOnly = new Date(utcDate.valueOf() + utcDate.getTimezoneOffset() * 60 * 1000)
        const date = format(new Date(utcDateOnly), 'MM/dd/yyyy')
        this.dueDate = date
        this.priority = priority
        this.bool = bool
        this.project = project
        this.notes = notes
    }
    
    getName() {
        return this.name
    }

    getDate() {
        return this.dueDate
    }

    getProject() {
        return this.project
    }

    getNotes() {
        return this.notes
    }

    changeName(name) {
        this.name = name
    }

    changeDate(dueDate) {
        const utcDate = new Date(dueDate)
        const utcDateOnly = new Date(utcDate.valueOf() + utcDate.getTimezoneOffset() * 60 * 1000)
        const date = format(new Date(utcDateOnly), 'MM/dd/yyyy')
        this.dueDate = date
    }
    
    changePriority (priority) {
        this.priority = priority
    }
    changeNotes (notes) {
        this.notes = notes
    }

    addToProject(project) {
        this.project = project
    }
    
    complete() {
        if (this.bool === false) {
            this.bool = true
        } else {
            this.bool = false
        }


    }
}