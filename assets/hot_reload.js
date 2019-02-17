(function(){
    var socket = new WebSocket('ws://localhost:3000/hot_reload');
    socket.onopen = () => {
        socket.send('connectting')
        console.log('connected to hot_reload server on 3001')
    }
    socket.onclose = console.log
    socket.onmessage = evt => {
        if (evt.data === 'reload page') {
            window.location.reload()
        }
    }
    socket.onerror = () => {
        console.log('连接热重载服务失败，请检查端口是否一致！')
    };
})()