window.exec = (function() {
    const directHandlers = {
        'scrollToTop': function() {
            var main = document.getElementById('main');
            if (main && main.scrollIntoView) {
                main.scrollIntoView()
            }
        },
        'goback': function() {
            window.history.back()
        }
    }
    return function(direct, opts) {
        return directHandlers[direct](opts)
    }
})()