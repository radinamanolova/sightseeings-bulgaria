(function () {
    document.querySelector(document).ready(function () {
        let pathname = window.location.pathname;
        document.querySelector('.nav-link[href="' + pathname + '"]').parent().classList.add('active');
    });
})()
