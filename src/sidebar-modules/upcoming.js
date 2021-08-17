function createUpcoming(main) {
    main.id = "upcoming"
    createHeader(main)

}


function createHeader(element) {
    const header = document.createElement('div')
    header.classList.add('title')
    header.textContent = "Upcoming"
    element.appendChild(header)
}

export default createUpcoming;