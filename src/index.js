import './style.css';

import format from 'date-fns/format';

function getDate() {
    const timeElapsed = Date.now()
    const today = format(new Date(timeElapsed), 'P')
    return today
}


class taskFactory {
    constructor(name, dueDate, priority) {
        this.name = name
        //converts date to correct time
        const utcDate = new Date(dueDate)
        const utcDateOnly = new Date(utcDate.valueOf() + utcDate.getTimezoneOffset() * 60 * 1000)
        const date = format(new Date(utcDateOnly), 'MM/dd/yyyy')
        this.dueDate = date
        this.priority = priority
        this.bool = false
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
const test = new taskFactory("Dishes", "2021-08-20", "1")

const test2 = new taskFactory("Laundry", "2021-05-16", "2")

const test3 = new taskFactory("Vacuum", "2021-05-17", "2")

let tasks = [test, test2, test3]





console.log(tasks)


const domWriter = (() => {
    const main = document.querySelector('.main')
    function loadPage(id) {
        if (main.id === id) {
            return
        }
        main.id = id
        createHeader(id)
        renderList(tasks, id)
    };

    function createHeader(id) {
        const title = document.querySelector('.title')
        title.textContent = id
    }

    function renderList(tasks, id) {
        appLogic.sortbyPrior()
        const list = document.querySelector('.list')
        while (list.firstChild) {
            list.removeChild(list.lastChild)
        }
        if (id === "Inbox") {
            for (let obj in tasks) {
                let task = document.createElement('div')
                task.classList.add('task-list')
                createChecker(task)
                createTaskContent(task, tasks, obj, 'name')
                createTaskContent(task, tasks, obj, 'dueDate')
                createTaskContent(task, tasks, obj, 'priority')
                createDelete(task, list)
                list.appendChild(task)
            }
        } else if (id === "Today") {
            const time = getDate()
            for (let obj in tasks) {
                if (tasks[obj]['dueDate'] === time) {
                    let task = document.createElement('div')
                    task.classList.add('task-list')
                    createChecker(task)
                    createTaskContent(task, tasks, obj, 'name')
                    createTaskContent(task, tasks, obj, 'dueDate')
                    createTaskContent(task, tasks, obj, 'priority')
                    createDelete(task, list)
                    list.appendChild(task)
                }
                
            }
        } else {
            const time = getDate()
            for (let obj in tasks) {
                
                //if statement if time is within a week of the current date
                let task = document.createElement('div')
                task.textContent = tasks[obj]['dueDate']
                list.appendChild(task)
            }
        }
    }

    function createTaskContent(task, tasks, obj, key) {
        let content = document.createElement('div')
        content.classList.add('task-item')
        if (key === 'priority') {
            switch (tasks[obj][key]) {
                case "1":
                    content.textContent = "Low"  
                    break;
                case "2":
                    content.textContent = "Med"   
                    break;
                case "3":
                    content.textContent = "High"
                    break;  
            }
        } else {
            content.textContent = tasks[obj][key]  
        }
        task.appendChild(content)
    }

    function createChecker(element) {
        const button = document.createElement('button')
        button.classList.add('checker')
        button.textContent= "Hello"
        button.addEventListener('click', () => {
            checkTask(element, button)
        })
        element.appendChild(button)
    }

    function createDelete(element, list) {
        const button = document.createElement('button')
        button.classList.add('delete')
        button.textContent= "Delete"
        button.addEventListener('click', () => {
            deleteTask(element, list)
        })
        element.appendChild(button)
    }

    function checkTask(element, button) {
       const index = element.children[1].textContent
       const object = tasks.find((task) => task.getName() === index)
       object.complete()
       console.log(object)
       if (object.bool === true) {
            button.classList.add('complete')
       } else {
           button.classList.remove('complete')
       }
    }

    function deleteTask(element, list) {
        const index = element.children[1].textContent
        tasks = tasks.filter((task) => task.name !== index)
        renderList(tasks, main.id)
    }
       
    

    function createTaskForm() {
        let checkForm = document.querySelector('form')
        if (!!checkForm) {
            return
        }
        const form = document.createElement('form')
        createInput("Name", 'text', form)
        createInput("Date", 'date', form)
        createPriority(form)
        createInput("Submit", 'submit', form)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            appLogic.appendTask(form)
            renderList(tasks, main.id)
            main.removeChild(form)
                
        })
        main.appendChild(form)
        
    }

    function createInput(name, type, element) {
        const input = document.createElement("input")
        // input.required = true
        input.type = type
        input.name = name
        input.placeholder = name
        if (name === "Submit") {
            input.value = "Add Task"
        }
        element.appendChild(input)
    }

    function createPriority(element) {
        let i = 1
        const values = ["Low", "Med", "High"]
        const dropdown = document.createElement('select')
        dropdown.name = "Priority"
        for (const val of values) {
            const option = document.createElement('option')
            option.value = i
            option.text = val
            dropdown.appendChild(option)
            i++
        }
        element.appendChild(dropdown)
    }


    function renderDate() {
        const time = document.querySelector('.time')
        time.textContent = getDate()
    }
    renderDate()

    
    return {loadPage, createTaskForm, renderDate};

})();


const appLogic = (() => {
    const sideBar = document.querySelectorAll('.sidebar-items')
    sideBar.forEach(item => {
        item.addEventListener('click', () => {
            let id = item.id
            switchTab(id)
        })
    })

    function switchTab(id) {
        const activeBtn = document.querySelector('.active')
        if (activeBtn) activeBtn.classList.remove('active')

        const tab = document.getElementById(id)
        tab.classList.add('active')
        domWriter.loadPage(id)
    }

    const addBtn = document.querySelector('.add-task')
    addBtn.addEventListener('click', () => {
        domWriter.createTaskForm()
    })

    function appendTask(form) {
        let newTask = new taskFactory(
            form.elements[0].value,
            form.elements[1].value, 
            form.elements[2].value)
            tasks.push(newTask)
            sortbyPrior()
            console.log(tasks)
    }

    function sortbyPrior() {
        tasks.sort(function (a, b) {
            return b['priority'] - a['priority']
        })
    }

    //temp for testing
    return {switchTab, appendTask, sortbyPrior};
})();



appLogic.switchTab("Inbox")
