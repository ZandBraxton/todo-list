import './style.css';
import createInbox from './sidebar-modules/inbox'


const domWriter = (() => {
   
    function loadPage(id) {
        switch(id) {
            case "inbox":
                createInbox(id)
                break;
        }
    };
    
    return {loadPage};

})();


const tabSwitcher = (() => {
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


})();