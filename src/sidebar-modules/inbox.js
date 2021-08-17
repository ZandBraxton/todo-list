function createInbox(main) {
    main.id = "inbox"
    createHeader(main)

}


function createHeader(element) {
    const header = document.createElement('div')
    header.classList.add('title')
    header.textContent = "Inbox"
    element.appendChild(header)
}

export default createInbox;