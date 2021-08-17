function createToday(main) {
    main.id = "today"
    createHeader(main)

}


function createHeader(element) {
    const header = document.createElement('div')
    header.classList.add('title')
    header.textContent = "Today"
    element.appendChild(header)
}

export default createToday;