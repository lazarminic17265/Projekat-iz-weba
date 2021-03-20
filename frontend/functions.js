export function createEl(tag, _classes, id){
    let el = document.createElement(tag)
    _classes.forEach(_class => {
        el.classList.add(_class)
    })
    if(id != undefined) el.id = id
    return el
}

export function createElWithInnerHtml(tag, _classes, innerHtml, id){
    let el = document.createElement(tag)
    _classes.forEach(_class => {
        el.classList.add(_class)
    })
    el.innerHTML = innerHtml
    if(id != undefined) el.id = id
    return el
}

export function createInput(_classes, type, id){
    let el = document.createElement("input")
    _classes.forEach(_class => {
        el.classList.add(_class)
    })
    el.type = type
    if(id != undefined) el.id = id
    return el
}