import './style.css';
import format from 'date-fns/format';
import {saveList, getList, saveProject, getProjects} from './modules/storage'
import taskFactory from './modules/taskfactory'
import projectFactory from './modules/projectfactory'

function getDate() {
    const timeElapsed = Date.now()
    const today = format(new Date(timeElapsed), 'P')
    return today
}

let tasks = []
let projects = []
// console.log(getList(tasks))
getList(tasks)
getProjects(projects)

console.log(tasks)
console.log(projects)


const domWriter = (() => {

const sidebarProject = document.querySelector('.projects')

function renderSidebar() {
    while (sidebarProject.firstChild) {
        sidebarProject.removeChild(sidebarProject.lastChild)
    }
    for (let obj in projects) {
        let sidebarProjectChild = document.createElement('div')
        sidebarProjectChild.id = projects[obj]['name']
        sidebarProjectChild.classList.add('sidebar-project')
        sidebarProjectChild.classList.add('sidebar-items')
        sidebarProjectChild.textContent = projects[obj]['name']
        createDeleteProjectBtn(sidebarProjectChild)
        sidebarProject.appendChild(sidebarProjectChild)
    }
}
renderSidebar()



    const main = document.querySelector('.main')
    function loadPage(id) {
        if (main.id === id) {
            return
        }
        main.id = id
        createHeader(id)
        createDesc(id)
        renderList(tasks, id)
    };

    function createHeader(id) {
        const title = document.querySelector('.title')
        title.textContent = id
    }

    function createDesc(id) {
        const object = projects.find((project) => project.getName() === id)
        const desc = document.querySelector('.desc')
        if (id === "Inbox" || id === "Today" || id === "Upcoming") {
            desc.textContent = ''
            return
        } else {
            desc.textContent = object.desc
        }
        
    }

    function renderList(tasks, id) {
        appLogic.sortbyPrior()
        const list = document.querySelector('.list')
        while (list.firstChild) {
            list.removeChild(list.lastChild)
        }
        console.log(id)
        if (id === "Today") {
            const time = getDate()
            for (let obj in tasks) {
                if (tasks[obj]['dueDate'] === time) {
                    let task = document.createElement('div')
                    task.classList.add('task-list')
                    const button = createCheckBtn(task)
                    createTaskContent(task, tasks, obj, 'name')
                    createTaskContent(task, tasks, obj, 'dueDate')
                    createTaskContent(task, tasks, obj, 'priority')
                    createTaskMenu(task)
                    appLogic.checkBtnListen(task, button)
                    list.appendChild(task)
                }
                
            }
        } else {
            for (let obj in tasks) {
                console.log(tasks[obj]['project'])
                if (tasks[obj]['project'] === id) {
                    let task = document.createElement('div')
                    task.classList.add('task-list')
                    const button = createCheckBtn(task)
                    createTaskContent(task, tasks, obj, 'name')
                    createTaskContent(task, tasks, obj, 'dueDate')
                    createTaskContent(task, tasks, obj, 'priority')
                    createTaskMenu(task)
                    appLogic.checkBtnListen(task, button)
                    list.appendChild(task)
                }
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

    function createCheckBtn(element) {
        const button = document.createElement('button')
        button.classList.add('checker')
        button.textContent= "Check"
        element.appendChild(button)
        return button
    }

    function createEditBtn(element, dropdown) {
        const button = document.createElement('button')
        button.classList.add('edit')
        button.textContent = "Edit"
        button.addEventListener('click', () => {
            let checkForm = document.querySelector('.edit-form')
            if (!!checkForm) {
                return
            }
            const form = document.createElement('form')
            form.classList.add('edit-form')
            createInput("Name", 'text', form)
            createInput("Date", 'date', form)
            const values = ["Low", "Med", "High"]
            createDropdown(form, values)
            createInput("Submit", 'submit', form)
            cancelPrompt(form)
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                appLogic.editTask(form, element)
                renderList(tasks, main.id)
                main.removeChild(form)
                    
            })
            main.appendChild(form)
        })
        dropdown.appendChild(button)
    }


    function createDeleteBtn(element, dropdown) {
            const button = document.createElement('button')
            button.classList.add('delete')
            button.textContent = "Delete"
            button.addEventListener('click', () => {
                appLogic.deleteTask(element)
                renderList(tasks, main.id)
            })
            dropdown.appendChild(button)
        }

    function createDeleteProjectBtn(element) {
        const button = document.createElement('button')
        button.classList.add('delete-project')
        button.textContent = "Delete"
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            appLogic.deleteProject(element)
            renderSidebar()   
            console.log(element.id)
            if (element.id === main.id) {
                appLogic.switchTab("Inbox")
            }
        }, true)
        element.appendChild(button)
    }

    function createAddToProjectBtn(element, dropdown) {
        const button = document.createElement('button')
        button.classList.add('add-to-project')
        button.textContent = "Add To Project"
        button.addEventListener('click', () => {
            let values = ["Inbox"]
            for (let obj in projects) {
                values.push(projects[obj]['name'])
            }
            let checkForm = document.querySelector('.add-task-to-project-form')
            if (!!checkForm) {
                return
            }
            const form = document.createElement('form')
            form.classList.add('add-task-to-project-form')
            createDropdown(form, values)
            createInput("Submit", 'submit', form)
            cancelPrompt(form)
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                appLogic.addToProject(form, element)
                renderList(tasks, main.id)
                main.removeChild(form)
                    
            })
            main.appendChild(form)


        })
        dropdown.appendChild(button)
    }
       

    function createTaskForm() {
        let checkForm = document.querySelector('.task-form')
        if (!!checkForm) {
            return
        }
        const form = document.createElement('form')
        form.classList.add('task-form')
        createInput("Name", 'text', form)
        createInput("Date", 'date', form)
        const values = ["Low", "Med", "High"]
        createDropdown(form, values)
        createInput("Submit", 'submit', form)
        cancelPrompt(form)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            appLogic.appendTask(form)
            renderList(tasks, main.id)
            main.removeChild(form)       
        })
        
        main.appendChild(form)
        
    }

    function createProjectForm() {
        let checkForm = document.querySelector('.project-form')
        if (!!checkForm) {
            return
        }
        const form = document.createElement('form')
        form.classList.add('project-form')
        createInput("Name", 'text', form)
        createInput("Description", 'text', form)
        createInput("Submit", 'submit', form)
        cancelPrompt(form)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            appLogic.appendProject(form)
            // renderList(tasks, main.id)
            main.removeChild(form)
                
        })
        main.appendChild(form)
    }

    function createInput(name, type, element) {
        const input = document.createElement("input")
        input.required = true
        input.type = type
        input.name = name
        input.placeholder = name
        if (name === "Submit") {
            input.value = "Confirm"
        }
        element.appendChild(input)
    }

    function createDropdown(element, values) {
        let i = 1
        const dropdown = document.createElement('select')
        for (const val of values) {
            const option = document.createElement('option')
            option.value = i
            option.text = val
            dropdown.appendChild(option)
            i++
        }
        element.appendChild(dropdown)
    }

    function cancelPrompt(form) {
        const remove = document.createElement('button')
        remove.textContent = "Cancel"
        remove.addEventListener('click', () => {
            main.removeChild(form)
        })
        form.appendChild(remove)
    }

    function createTaskMenu(element) {
        const menu = document.createElement('div')
        const figure = document.createElement('figure')
        menu.appendChild(figure)

        const middle = document.createElement('figure')
        middle.classList.add('menu-middle')
        menu.appendChild(middle)

        const cross = document.createElement('p')
        cross.classList.add('menu-cross')
        cross.textContent = "X"
        menu.appendChild(cross)

        const figure2 = document.createElement('figure')
        menu.appendChild(figure2)

        const dropdown = document.createElement('ul')
        dropdown.classList.add('menu-dropdown')
        createEditBtn(element, dropdown)
        createAddToProjectBtn(element, dropdown)
        createDeleteBtn(element, dropdown)

        menu.appendChild(dropdown)
        element.appendChild(menu)
    }
 

    function renderDate() {
        const time = document.querySelector('.time')
        time.textContent = getDate()
    }
    renderDate()

    
    return {loadPage, createTaskForm, createProjectForm, renderDate, renderList, renderSidebar};

})();


const appLogic = (() => { 
   
    function bindSidebar() {
        const sideBar = document.querySelectorAll('.sidebar-items')
        sideBar.forEach(item => {
            item.addEventListener('click', () => {
                let id = item.id
                switchTab(id)
            })
        })
   } 
   bindSidebar()

    function switchTab(id) {
        const activeBtn = document.querySelector('.active')
        if (activeBtn) activeBtn.classList.remove('active')

        let tab = document.getElementById(id)
        if (tab === null) {
            tab = document.getElementById("Inbox")
        }
        tab.classList.add('active')
        domWriter.loadPage(id)
    }

    const addTaskBtn = document.querySelector('.add-task')
    addTaskBtn.addEventListener('click', () => {
        domWriter.createTaskForm()
    })

    const addProjectBtn = document.querySelector('.add-project')
    addProjectBtn.addEventListener('click', () => {
       domWriter.createProjectForm()
    })

    function appendTask(form) {
        let newTask = new taskFactory({
            name: form.elements[0].value,
            dueDate: form.elements[1].value, 
            priority: form.elements[2].value,
            bool: false,
            project: "Inbox"})
            if (tasks.find((task) => task.getName().toUpperCase() === newTask.getName().toUpperCase())) {
                alert("Cannot enter task with same name")
                return
            } 
            tasks.push(newTask)
            sortbyPrior()
            console.log(tasks)
            saveList(tasks)
    }

    function appendProject(form) {
        let newProject = new projectFactory({
            name: form.elements[0].value,
            desc: form.elements[1].value})
            if (projects.find((project) => project.getName().toUpperCase() === newProject.getName().toUpperCase())) {
                alert("Cannot enter project with same name")
                return
            } 
        projects.push(newProject)
        saveProject(projects)
        domWriter.renderSidebar()
        bindSidebar()
    }

    function sortbyPrior() {
        tasks.sort(function (a, b) {
            return b['priority'] - a['priority']
        })
    }

    function checkBtnListen(element, button) {
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        button.addEventListener('click', () => {
            object.complete()
            saveList(tasks)
            checkTask(object, button)
        })
        checkTask(object, button)
        
    }

    function checkTask(object, button) {
        if (object.bool === true) {
                button.classList.add('complete')
        } else {
            button.classList.remove('complete')
        }
    }

    function editTask(form, element) {
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        object.changeName(form.elements[0].value)
        object.changeDate(form.elements[1].value)
        object.changePriority(form.elements[2].value)
        saveList(tasks)
    }

    function deleteTask(element) {
        const index = element.children[1].textContent
        tasks = tasks.filter((task) => task.name !== index)
        saveList(tasks)
    }

    function addToProject(form, element) {
        const select = form.firstChild
        const name = select.children[form.elements[0].value - 1].textContent
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        object.addToProject(name)
        saveList(tasks)
    }

    function deleteProject(element) {
        const index = element.id
        console.log(index)
        deleteTasksfromProject(index)
        projects = projects.filter((project) => project.name !== index)
        saveProject(projects)
    }

    function deleteTasksfromProject(index) {
        tasks = tasks.filter((task) => task.project !== index)
        saveList(tasks)
    }

    //temp for testing
    return {
        switchTab, 
        appendTask, 
        appendProject, 
        sortbyPrior, 
        checkBtnListen,
        editTask, 
        deleteTask,
        addToProject,
        deleteProject
    };
})();






appLogic.switchTab("Inbox")
