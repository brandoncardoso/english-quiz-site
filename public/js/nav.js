document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#navbar-burger').addEventListener('click', burgerClickHandler)
})

function burgerClickHandler(element) {
    document.querySelector('#navbar-menu').classList.toggle('is-active')
}

