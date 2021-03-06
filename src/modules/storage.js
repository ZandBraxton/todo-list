import taskFactory from "./taskfactory"
import projectFactory from "./projectfactory"


function saveList(data) {
    localStorage.setItem('tasks', JSON.stringify(data))
}

function saveProject(data) {
    localStorage.setItem('projects', JSON.stringify(data))
}

function getList(tasks) {
    const storedTasks =  JSON.parse(localStorage.getItem('tasks') || "[]")
    for (let i = 0; i < storedTasks.length; i++) {
        let task = new taskFactory(storedTasks[i])
        tasks.push(task)
    }
}



function getProjects(projects, tasks) {
    const storedProjects =  JSON.parse(localStorage.getItem('projects') || "[]")
    for (let i = 0; i < storedProjects.length; i++) {
        let project = new projectFactory(storedProjects[i])
        for (let task in tasks) {
            if (tasks[task]['project'] === project.getName())
            project.pushTask(tasks[task])
        }
        projects.push(project)
    }
}

    


export {saveList, getList, saveProject, getProjects}
