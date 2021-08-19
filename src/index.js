import './style.css';

import format from 'date-fns/format';

function getDate() {
    const timeElapsed = Date.now()
    const today = format(new Date(timeElapsed), 'P')
    return today
}


const test = {
    title:"name", desc:"description here", dueDate:"05/16/2021", priority:"2"
}

const test2 = {
    title:"name", desc:"description here", dueDate:"8/19/2021", priority:"2"
}
const tasks = [test, test2]

class taskFactory {
    constructor(title, desc, dueDate, priority) {
        this.title = title
        this.desc = desc
        const date = format(new Date(dueDate), 'P')
        this.dueDate = date
        this.priority = priority
        this.complete = false
    }
}

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
        const list = document.querySelector('.list')
        while (list.firstChild) {
            list.removeChild(list.lastChild)
        }
        if (id === "Inbox") {
            for (let obj in tasks) {
                let task = document.createElement('div')
                task.classList.add('task-list')
                createTaskContent(task, tasks, obj, 'title')
                createTaskContent(task, tasks, obj, 'desc')
                createTaskContent(task, tasks, obj, 'dueDate')
                createTaskContent(task, tasks, obj, 'priority')
                list.appendChild(task)
            }
        } else if (id === "Today") {
            const time = getDate()
            for (let obj in tasks) {
                if (tasks[obj]['dueDate'] === time) {
                    let task = document.createElement('div')
                    task.classList.add('task-list')
                    createTaskContent(task, tasks, obj, 'title')
                    createTaskContent(task, tasks, obj, 'desc')
                    createTaskContent(task, tasks, obj, 'dueDate')
                    createTaskContent(task, tasks, obj, 'priority')
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
        content.textContent = tasks[obj][key]  
        task.appendChild(content)
    }
       
    

    function createTaskForm() {
        let checkForm = document.querySelector('form')
        if (!!checkForm) {
            return
        }
        const form = document.createElement('form')
        createInput("Title", 'text', form)
        createInput("Description", 'text', form)
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
        const values = [1, 2, 3, 4, 5]
        const dropdown = document.createElement('select')
        dropdown.name = "Priority"
        for (const val of values) {
            const option = document.createElement('option')
            option.value = val
            option.text = val
            dropdown.appendChild(option)
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
            form.elements[2].value, 
            form.elements[3].value)
            tasks.push(newTask)
    }

    //temp for testing
    return {switchTab, appendTask};
})();



appLogic.switchTab("Inbox")
