window.exec = (function() {
    const commandHandlers = {
        'scrollToTop': function() {
            var main = document.getElementById('main');
            if (main && main.scrollIntoView) {
                main.scrollIntoView()
            }
        },
        'scrollToBottom': function() {
            var footer = document.getElementById('footer');
            if (footer && footer.scrollIntoView) {
                footer.scrollIntoView()
            }
        },
        'goback': function() {
            window.history.back()
        },
        'gotoGithub': function() {
            window.location.href = 'https://github.com/qoxop'
        },
        'linkTo': function (url) {
            window.location.href = window.location.origin + url
        }
    }
    return function(command, opts) {
        if(typeof commandHandlers[command] === 'function') {
            return commandHandlers[command](opts)
        }
        console.error('command does not exist!');
        return console.log
    }
})()

// 简易自定义事件
const myEvent = {
    cbsStore: {},
    on: function (eventStr, cb) {
        if(!this.cbsStore[eventStr]) {
            this.cbsStore[eventStr] = []
        }
        this.cbsStore[eventStr].push(cb)
    },
    emit: function(eventStr, ...other) {
        if(this.cbsStore[eventStr]) {
            this.cbsStore[eventStr].forEach(cb => {
                cb(...other)
            });
        }
    },
    rmListerer: function(eventStr) {
        this.cbsStore[eventStr] = null
    }
}

function autoDisplayHeader() {
    const header = document.getElementById('app_header');
    myEvent.on('scrollUp', function name(e) {
        header.classList.remove('hide')
    })
    myEvent.on('scrollDown', function name(e) {
        header.classList.add('hide')
    })
}
function scrollHander() {
    const main = document.getElementById('main');
    let PreY = main.getBoundingClientRect().y;
    let dec = 0;
    window.onscroll = function(e) {
        if(dec === 0) {
            dec = setTimeout(() => {
                dec = 0;
                if(main.getBoundingClientRect().y - PreY < -5) {
                    myEvent.emit('scrollDown', e);
                    PreY = main.getBoundingClientRect().y;
                }
                if(main.getBoundingClientRect().y - PreY > 5) {
                    myEvent.emit('scrollUp', e);
                    PreY = main.getBoundingClientRect().y;
                }
            }, 50)
        }
    }
}

window.addEventListener('load', function() {
    scrollHander()
    autoDisplayHeader()
})