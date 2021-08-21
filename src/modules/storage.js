import taskFactory from "./taskfactory"


function saveList(data) {
    localStorage.setItem('tasks', JSON.stringify(data))
}

function getList(tasks) {
    console.log(JSON.parse(localStorage.getItem('tasks') || "[]"))
    const storedTasks =  JSON.parse(localStorage.getItem('tasks'))
    for (let i = 0; i < storedTasks.length; i++) {
        let task = new taskFactory(storedTasks[i])
        tasks.push(task)
    }
}

    


export {saveList, getList}
