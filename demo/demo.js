function MyEvent() {
    let cbsStore = {};
    return {
        on: function (eventStr, cb) {
            if(!cbsStore[eventStr]) {
                cbsStore[eventStr] = []
            }
            cb.stopId = Date.now().toString() + Math.random().toString().replace('0.', '')
            cbsStore[eventStr].push(cb)
            return cb.stopId;
        },
        emit: function(eventStr, ...other) {
            if(cbsStore[eventStr]) {
                cbsStore[eventStr].forEach(cb => {
                    cb(...other)
                });
            }
        },
        removeListener: function(eventStr, stopId) {
            if(cbsStore[eventStr]) {
                cbsStore[eventStr] = cbsStore[eventStr].filter(cb => cb.stopId !== stopId);
            }
        },
        clearListener: function(eventStr) {
            cbsStore[eventStr] = null
        },
        destroy: () => {
            cbsStore = {};
        }
    }
}

const Service = {
    saveFares: function(jsonData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000);
        })
    },
    getFares: function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000);
        })
    },
    saveFinishedOrder: function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 1000);
        })
    }
}


const createFaresController = (function() {
    const BILL_OF_FARE = 'bill_of_fare';
    let controller = null;
    let data = null;
    const eventTypes = {
        add: 'add',
        remove: 'remove',
        modify: 'modify',
        update: 'update'
    }
    const FareEvent =  MyEvent();
    return function () {
        if (controller === null) {
            controller = {
                eventTypes,
                addEventListener: function(type, cb) {
                    FareEvent.on(type, cb)
                },
                clearListener: FareEvent.clearListener,
                find: function(id) {
                    return this.data.find(item => item.id === id);
                },
                add: function(fare) {
                    fare.id = Date.now().toString();
                    this.data = this.data.concat([fare]);
                    FareEvent.emit(eventTypes.add, fare);
                },
                remove: function(fare) {
                    this.data = this.data.filter(item => item.id !== fare.id)
                    FareEvent.emit(eventTypes.remove, fare)
                },
                modify: function(fare) {
                    this.data = this.data.map(item => item.id !== fare.id ? item : fare) 
                    FareEvent.emit(eventTypes.modify, fare);
                },
                refresh: function() {
                    return new Promise((resolve, reject) => {
                        Service.getFares().then(res => {
                            this.data = res.data;
                            FareEvent.emit(eventTypes.update)
                            resolve();
                        }).catch(() => {
                            this.data = [];
                            FareEvent.emit(eventTypes.update)
                            reject();
                        })
                    })
                },
                save: function() {
                    return new Promise((resolve, reject) => {
                        if(data) {
                            // 保存到服务端和本地缓存
                            Service.saveFares(data).then(() => {
                                this.data = data;
                                resolve()
                            }).catch(err => {
                                reject(err)
                            })
                        } else {
                            reject('数据为空')
                        }
                    })
                    
                }
            }
            Object.defineProperties(controller, {
                'data': {
                    get: function() {
                        if (!data) {
                            try {
                                data = JSON.parse(localStorage.getItem(BILL_OF_FARE))
                            } catch (error) {
                                data = []
                            }
                            return data;
                        }
                        return data;
                    },
                    set: function(newData) {
                        data = newData;
                        localStorage.setItem(BILL_OF_FARE, JSON.stringify(data));
                    }
                }
            })
        }
        return controller;
    }
})()

const createOrderController = (function() {
    const orderEvent = MyEvent();
    const eventTypes = {
        addFare: 'addFare',
        placeAnOrder: 'placeAnOrder',
        finishOrder: 'finishOrder'
    }
    const ORDERS = 'ORDERS';
    const CUR_ORDER = 'CUR_ORDER';
    let cur_order = null;
    let orders = null;
    let controller = null;
    return function() {
        if (!controller) {
            controller = {
                eventTypes,
                addEventListener(type, cb) {
                    orderEvent.on(type, cb)
                },
                addFare(fare) {
                    if(!this.cur_order) {
                        this.cur_order = {fares: [], pay: 0}
                    }
                    cur_order.fares.push(fare);
                    cur_order.pay = cur_order.pay + (fare.price * fare.discount);
                    this.cur_order = cur_order;
                    orderEvent.emit(eventTypes.addFare, fare)
                },
                didOrder() {
                    if(this.cur_order && this.cur_order.fares && this.cur_order.fares.length) {
                        this.orders = this.orders.concat([{
                            ...this.cur_order,
                            id: (Date.now() + Math.random().toString()).replace('0.', '-'),
                            time: Date.now(),
                            tableNum: this.orders.length + 1
                        }])
                        this.cur_order = null;
                        orderEvent.emit(eventTypes.placeAnOrder)
                    } else {
                        alert('error')
                    }
                },
                finishOrder(orderId) {
                    this.orders = this.orders.filter(order => {
                        if(order.id === orderId) {
                            Service.saveFinishedOrder(order);
                        }
                        return order.id !== orderId
                    })
                    orderEvent.emit(eventTypes.finishOrder)
                }
            }
            Object.defineProperties(controller, {
                "cur_order": {
                    get: function() {
                        if (!cur_order) {
                            try {
                                cur_order = JSON.parse(localStorage.getItem(CUR_ORDER))
                            } catch (error) {
                                cur_order = null;
                            }
                        }
                        return cur_order;
                    },
                    set: function(order) {
                        cur_order = order;
                        localStorage.setItem(CUR_ORDER, JSON.stringify(cur_order))
                    }
                },
                "orders": {
                    get: function() {
                        if (!orders) {
                            try {
                                orders = JSON.parse(localStorage.getItem(ORDERS) || '[]')
                            } catch (error) {
                                orders = [];
                            }
                        }
                        return orders;
                    },
                    set: function(newOrders) {
                        orders = newOrders;
                        localStorage.setItem(ORDERS, JSON.stringify(orders))
                    }
                }
            })
        }
    }
})()
