const randomFunctions = {
    S4,
    guid,
    randomIndex,
}

function guid() {
    return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase()
}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

function randomIndex() {
    return Math.random() * 10000000
}

export default randomFunctions