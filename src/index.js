import './style.css';
import createInbox from './sidebar-modules/inbox'
import createToday from './sidebar-modules/today'
import createUpcoming from './sidebar-modules/upcoming'
import format from 'date-fns/format';


class taskFactory {
    constructor(title, desc, dueDate, priority) {
        return {title, desc, dueDate, priority}
    }
}


const domWriter = (() => {
    const main = document.querySelector('.main')
    function loadPage(id) {
        if (main.id === id) {
            return
        }
        removePage(main)
        switch(id) {
            case "inbox":
                createInbox(main)
                break;
            case "today":
                createToday(main)
                break;
            case "upcoming":
                createUpcoming(main)
                break;
        }
    };

    function removePage(main) {
        while(main.firstChild) {
            main.removeChild(main.lastChild)
        }
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
            let newTask = new taskFactory(
                form.elements[0].value,
                form.elements[1].value, 
                form.elements[2].value, 
                form.elements[3].value)
                console.log(newTask)
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


    function getDate() {
        const time = document.querySelector('.time')
        const date = new Date()
        let today = `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`
        time.textContent = today
    }
    getDate()
    
    return {loadPage, createTaskForm};

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

    //temp for testing
    return {switchTab};
})();



appLogic.switchTab("inbox")