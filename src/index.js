import './style.css';
import createInbox from './sidebar-modules/inbox'
import createToday from './sidebar-modules/today'
import createUpcoming from './sidebar-modules/upcoming'
import format from 'date-fns/format';


const taskFactory = (title, desc, dueDate, priority) => {
    return {title, desc, dueDate, priority}
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
        //need more parameters and css
        //look up date-fns docs for data info
        let checkForm = document.querySelector('form')
        if (!!checkForm) {
            return
        }
        const form = document.createElement('form')
        createInput("Title", form)
        createInput("Description", form)
        main.appendChild(form)
        
    }

    function createInput(name, element) {
        const input = document.createElement("input")
        input.required = true
        input.setAttribute('type', 'text')
        input.setAttribute('name', name)
        input.setAttribute('placeholder', name)
        element.appendChild(input)
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