function createPage(main, id, tasks) {
    // createTasksList(main, tasks)

}



function createTasksList(element, tasks) {
    const list = document.createElement('div')
    list.id = "list"
    while (list.firstChild) {
        list.removeChild(list.lastChild)
    }
    for (let obj in tasks) {
        let task = document.createElement('div')
        task.textContent = tasks[obj]['title']
        list.appendChild(task)
    }
    element.appendChild(list)
}



export {createPage, createTasksList};