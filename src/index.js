import './style.css';


const domWriter = (() => {
   


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
    }

})();