import './style.css';
import {format, isThisWeek, compareAsc, addDays} from 'date-fns'
import {saveList, getList, saveProject, getProjects} from './modules/storage'
import taskFactory from './modules/taskfactory'
import projectFactory from './modules/projectfactory'

function getDate() {
    const timeElapsed = Date.now()
    const today = format(new Date(timeElapsed), 'P')
    return today
}

function compareDate(dueDate) {
    let time = getDate()
    let result = compareAsc(new Date(dueDate), new Date(time))
    if (result === 1 || result === 0) {
        let week = addDays(new Date(time), 7)
        result = compareAsc(new Date(dueDate), week)
        if (result === -1 || result === 0) {
            return true
        }
    } else {
        return false
    }
}

function transition(element) {
    element.classList.add('show')
}


let tasks = []
let projects = []
getList(tasks)
getProjects(projects, tasks)




const domWriter = (() => {

const sidebarProject = document.querySelector('.projects')
const noteDom = document.createElement('div')

function renderSidebar() {
    while (sidebarProject.firstChild) {
        sidebarProject.removeChild(sidebarProject.lastChild)
    }
    mainCounter()
    for (let obj in projects) {
        let sidebarProjectContainer = document.createElement('div')
        sidebarProjectContainer.id = projects[obj]['name']
        sidebarProjectContainer.classList.add('sidebar-project')
        sidebarProjectContainer.classList.add('sidebar-items')

        let sidebarProjectChild = document.createElement('p')
        sidebarProjectChild.id = projects[obj]['name']
        sidebarProjectChild.textContent = projects[obj]['name']
        sidebarProjectChild.classList.add('sidebar-item-name')
        sidebarProjectContainer.appendChild(sidebarProjectChild)

        createCounter(projects[obj], sidebarProjectContainer)

        sidebarProjectChild.textContent = projects[obj]['name']
        createTaskMenu(sidebarProjectContainer)
        sidebarProject.appendChild(sidebarProjectContainer)
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
        noteDom.textContent = ''
    };

    function createHeader(id) {
        const title = document.querySelector('.title')
        title.textContent = id
    }

    function createDesc(id) {
        const object = projects.find((project) => project.getName() === id)
        const desc = document.querySelector('.desc')
        if (id === "Inbox" || id === "Today") {
            desc.textContent = ''
            return
        } else if (id === "Upcoming"){
            desc.textContent = "Due within the next seven days"
        } else {
            desc.textContent = object.desc
        }
        
    }

    function createCounter(name, element) {
        let i = 0;
        for (let obj in name['list']) {
            if (name['list'][obj]['bool'] === false) {
                i++
            }
        }
        let counter = document.createElement('p')
        if (i === 0) {
            counter.textContent = ''
        } else {
            counter.textContent = i
            counter.classList.add('project-counter')
        }
        element.appendChild(counter)

    }

    function mainCounter() {
        const inbox = document.querySelector('.inbox-counter')
        const today = document.querySelector('.today-counter')
        const upcoming = document.querySelector('.upcoming-counter')

        const time = getDate()
        let inboxCounter = 0
        let todayCounter = 0
        let upcomingCounter = 0
        for (let obj in tasks) {
            if (tasks[obj]['bool'] === false) {
                if (tasks[obj]['project'] === "Inbox") {
                    inboxCounter++
                }
                if (tasks[obj]['dueDate'] === time) {
                    todayCounter++
                }
                if (compareDate(tasks[obj]['dueDate']) === true) {
                    upcomingCounter++
                }
            }
           
        }

        if (inboxCounter === 0) {
            inbox.textContent = ''
            inbox.classList.remove('project-counter')
        } else {
            inbox.textContent = inboxCounter
            inbox.classList.add('project-counter')
        }

        if (todayCounter === 0) {
            today.textContent = ''
            today.classList.remove('project-counter')
        } else {
            today.textContent = todayCounter
            today.classList.add('project-counter')
        }
        if (upcomingCounter === 0) {
            upcoming.textContent = ''
            upcoming.classList.remove('project-counter')
        } else {
            upcoming.textContent = upcomingCounter
            upcoming.classList.add('project-counter')
        }   
    }

    function renderList(tasks, id) {
        appLogic.sortbyPrior()
        const list = document.querySelector('.list')
        while (list.firstChild) {
            list.removeChild(list.lastChild)
        }
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
        } else if (id === "Upcoming") {
            for (let obj in tasks) {
                if (compareDate(tasks[obj]['dueDate']) === true) {
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
                if (tasks[obj]['project'] === id) {
                    let task = document.createElement('div')
                    task.classList.add('task-list')
                    const button = createCheckBtn(task)
                    createTaskContent(task, tasks, obj, 'name')
                    createTaskContent(task, tasks, obj, 'dueDate')
                    createTaskContent(task, tasks, obj, 'priority')
                    createTaskMenu(task)
                    task.addEventListener('click', () => {
                       appLogic.getNotes(task)
                    })
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
        const span = document.createElement('span')
        span.classList.add('material-icons')
        span.textContent = "check_circle"
        button.appendChild(span)
        element.appendChild(button)
        return button

    }

    function createEditBtn(element, dropdown) {
        const button = document.createElement('button')
        button.classList.add('edit')
        button.textContent = "Edit"
        button.addEventListener('click', () => {
            let checkForm = document.querySelector('form')
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
                mainCounter()
                main.removeChild(form)
                    
            })
            main.appendChild(form)
        })
        dropdown.appendChild(button)
    }

    function createEditProjectBtn(element, dropdown) {
        const button = document.createElement('button')
        button.classList.add('edit-project')
        button.textContent = "Edit"
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            let checkForm = document.querySelector('form')
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
                appLogic.editProject(form, element)
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
                renderSidebar()
                appLogic.bindSidebar()
            })
            dropdown.appendChild(button)
        }

    function createDeleteProjectBtn(element, dropdown) {
        const button = document.createElement('button')
        button.classList.add('delete-project')
        button.textContent = "Delete"
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            appLogic.deleteProject(element)
            renderSidebar()  
            if (element.id === main.id) {
                appLogic.switchTab("Inbox")
            }
        }, true)
        dropdown.appendChild(button)
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
            let checkForm = document.querySelector('form')
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
                renderSidebar()
                appLogic.bindSidebar()
                main.removeChild(form)
                    
            })
            main.appendChild(form)


        })
        dropdown.appendChild(button)
    }
       

    function createTaskForm() {
        let checkForm = document.querySelector('form')
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
            mainCounter()
            main.removeChild(form)       
        })
        
        main.appendChild(form)
        
    }

    function createProjectForm() {
        let checkForm = document.querySelector('form')
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
            main.removeChild(form)
                
        })
        main.appendChild(form)
    }

    function createInput(name, type, element) {
        const label = document.createElement('label')
        const input = document.createElement('input')
        label.textContent = name
        label.classList.add('label')
        input.required = true
        input.type = type
        input.name = name
        input.placeholder = name
        if (name === "Name") {
            input.maxLength = "18"
        }
        if (name === "Submit") {
            input.value = "Confirm"
            label.textContent = ''
        }
        element.appendChild(label)
        element.appendChild(input)
    }

    function createDropdown(element, values) {
        let i = 1
        const label = document.createElement('label')
        if (values[0] === "Inbox") {
            label.textContent = "Projects"
        } else {
            label.textContent = "Priority"
        }
        const dropdown = document.createElement('select')
        for (const val of values) {
            const option = document.createElement('option')
            option.value = i
            option.text = val
            dropdown.appendChild(option)
            i++
        }
        element.appendChild(label)
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
        menu.textContent = "more_vert"
        menu.classList.add('menu')
        menu.classList.add('material-icons')

        const dropdown = document.createElement('div')
        dropdown.classList.add('menu-dropdown')
        dropdown.classList.add('transition-wrapper')
        if (element.classList.contains('task-list')) {
            createEditBtn(element, dropdown)
            createAddToProjectBtn(element, dropdown)
            createDeleteBtn(element, dropdown)
        } else {
            createEditProjectBtn(element, dropdown)
            createDeleteProjectBtn(element, dropdown)
        }
        menu.addEventListener('click', (e) => {
            e.stopPropagation()
            if (dropdown.classList.contains('active')) {
                dropdown.classList.remove('show')
                setTimeout(function () {dropdown.classList.remove('active')}, 300)
            } else {
                let openMenu = document.querySelectorAll('.active')
                openMenu.forEach(menu => {
                    menu.classList.remove('active')
                    dropdown.classList.remove('show')
                })
            dropdown.classList.toggle('active')
            setTimeout(function () {transition(dropdown)}, 100)
            }
        }) 
        menu.appendChild(dropdown)
        element.appendChild(menu)
    }

    window.onclick = () => {
        let openMenu = document.querySelectorAll('.active')
                openMenu.forEach(menu => {
                    menu.classList.remove('active')
                    menu.classList.remove('show')
                })
    }

    function renderNotes(element, object) {
        const activeNote = document.querySelector('.note-active')
        if (element.classList.contains('note-active')) {
                element.classList.toggle('note-active')
                noteDom.remove()
                return
            } else {
                if (!!activeNote) {
                activeNote.classList.remove('note-active') 
                }
                element.classList.toggle('note-active')
            }
        noteDom.classList.add('notes')
        noteDom.textContent = object.getNotes()
        const button = document.createElement('button')
        button.textContent = "Edit Notes"
        button.classList = "edit-note"
        button.addEventListener('click', (e) => {
            e.stopPropagation()
            let checkForm = document.querySelector('form')
            if (!!checkForm) {
                return
            }
            const form = document.createElement('form')
            form.classList.add('note-form')
            createInput("Notes", 'text', form)
            createInput("Submit", 'submit', form)
            cancelPrompt(form)
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                appLogic.editNotes(element, form, object)
                main.removeChild(form)
            })
            main.appendChild(form)
        })       
        noteDom.appendChild(button)
        element.appendChild(noteDom)
    }

    // function clearNotes() {
    //     document.querySelector('note-active') {

    //     }
    // }
 

    function renderDate() {
        const time = document.querySelector('.time')
        time.textContent = getDate()
    }
    renderDate()
    

    
    return {
        loadPage,
        createDesc, 
        createTaskForm, 
        createProjectForm,
        mainCounter, 
        renderDate, 
        renderList,
        renderNotes, 
        renderSidebar};

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

    function switchTab(id) {
        const activeBtn = document.querySelector('.tab-active')
        if (activeBtn) activeBtn.classList.remove('tab-active')

        let tab = document.getElementById(id)
        if (tab === null) {
            tab = document.getElementById("Inbox")
        }
        tab.classList.add('tab-active')
        domWriter.loadPage(id)
        bindSidebar()
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
            project: "Inbox",
            notes: "No Notes to Display"})
            if (tasks.find((task) => task.getName().toUpperCase() === newTask.getName().toUpperCase())) {
                alert("Cannot enter task with same name")
                return
            } 
            tasks.push(newTask)
            sortbyPrior()
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


    function getNotes(element) {
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        domWriter.renderNotes(element, object)
    }

    function editNotes(element, form, object) {
        object.changeNotes(form.elements[0].value)
        saveList(tasks)
        domWriter.renderNotes(element, object)
    }

    function checkBtnListen(element, button) {
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        const project = document.querySelector('.tab-active')
        button.addEventListener('click', () => {
            object.complete()
            saveList(tasks)
            domWriter.renderSidebar()
            switchTab(project.id)
            checkTask(object, button)
        })
        checkTask(object, button)
        
    }

    function checkTask(object, button) {
        if (object.bool === true) {
            button.firstChild.classList.add('complete')
        } else {
            button.firstChild.classList.remove('complete')
        }
    }

    function editTask(form, element) {
        if (tasks.find((task) => task.getName().toUpperCase() === form.elements[0].value.toUpperCase()) 
            && element.children[1].textContent.toUpperCase() !== form.elements[0].value.toUpperCase()) {
            alert("Cannot enter task with same name")
            return
        }
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        object.changeName(form.elements[0].value)
        object.changeDate(form.elements[1].value)
        object.changePriority(form.elements[2].value)
        saveList(tasks)
    }

    function deleteTask(element) {
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        const project = projects.find((project) => project.getName() === object.getProject())
        console.log(typeof project)
        if (typeof project != "undefined") {  
            project.popTask(object)
        }
        tasks = tasks.filter((task) => task.name !== index)
        saveList(tasks)
        saveProject(projects)
    }

    function addToProject(form, element) {
        const select = form.children[1]
        const name = select.children[form.elements[0].value - 1].textContent
        const index = element.children[1].textContent
        const object = tasks.find((task) => task.getName() === index)
        object.addToProject(name)
        const project = projects.find((project) => project.getName() === name)
        if (project === null) {
            return
        } else {
            project.pushTask(object)
        }
        saveList(tasks)
        saveProject(projects)
    }

    function editProject(form, element) {
        if (projects.find((project) => project.getName().toUpperCase() === form.elements[0].value.toUpperCase())
            && element.id.toUpperCase() !== form.elements[0].value.toUpperCase()) {
            alert("Cannot enter project with same name")
            return
        }
        const index = element.id
        const object = projects.find((project) => project.getName() === index)
        object.changeName(form.elements[0].value)
        object.changeDesc(form.elements[1].value)
        const taskObject = tasks.find((task) => task.getProject() === index)
        if (taskObject) {
            taskObject.addToProject(form.elements[0].value)
            saveList(tasks)
        }
        saveProject(projects)
        domWriter.renderSidebar()
        bindSidebar()
        switchTab(object.getName())
        domWriter.createDesc(object.getName())

    }

    function deleteProject(element) {
        const index = element.id
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
        bindSidebar, 
        appendTask, 
        appendProject, 
        sortbyPrior,
        getNotes,
        editNotes, 
        checkBtnListen,
        editTask, 
        deleteTask,
        addToProject,
        editProject,
        deleteProject,
    };
})();






appLogic.switchTab("Inbox")
