import { Cocktail } from "./cocktail.js"
import { Bar } from "./bar.js"
import { Drink } from "./drink.js"
import { createEl, createElWithInnerHtml, createInput } from "./functions.js"

var bars = []
var drinks = []
var totalCocktailAmmount = 250
var currCost = 0
var canvasHeight = 250
var canvasWidth = 150
var p1 = 0.15, p2 = 0.85 //parametar 1 i 2

render()

function renderBar(bar, container) {
    let divBar = createEl("div", ["divBar", "flexContCol"], "divBar" + bar.id)
    let divBarName = createElWithInnerHtml("h2", ["divBarName"], bar.name)
    divBar.appendChild(divBarName)
    let divBarContent = createEl("div", ["divBarContent", "flexContRow"])
    renderDrinks(bar, divBarContent)
    renderNewCocktail(bar, divBarContent)
    renderCocktails(bar, divBarContent)
    divBar.appendChild(divBarContent)
    divBar.appendChild(createEl("hr", []))
    container.appendChild(divBar)
}

function renderDrinks(bar, container) {
    let divDrinks = createEl("div", ["divDrinks", "flexContCol"], "divDrinks" + bar.id)
    bar.drinks.forEach((el, i) => {
        el.render(divDrinks, onDrinkAmmountChange)
    })
    container.appendChild(divDrinks)
}

function setLiquidPoints(canvasWidth = canvasWidth, canvasHeight = canvasHeight, amount, color, liquid, i = 0, lastDrinkPoints = [],
    totalCocktailAmmount = 250, p1 = 0.15, p2 = 0.85) {
    let x1, y1, x2, y2, x3, y3, x4, y4
    let currDrinkPoints = []
    for (let i = 0; i < 4; i++) {
        currDrinkPoints.push({ x: 0, y: 0 })
    }
    let liquidHeight = (1 - amount / totalCocktailAmmount) * canvasHeight
    let x = ((canvasWidth * p1) / canvasHeight) * liquidHeight
    if (i == 0) {
        liquid.setAttribute("points", (x + "," + liquidHeight + " ") + ((canvasWidth - x) + "," + liquidHeight + " ") +
            (p2 * canvasWidth + "," + canvasHeight + " ") + (p1 * canvasWidth + "," + canvasHeight))
        x1 = x; y1 = liquidHeight
        x2 = (canvasWidth - x); y2 = liquidHeight
        x3 = p2 * canvasWidth; y3 = canvasHeight
        x4 = p1 * canvasWidth; y4 = canvasHeight
    }
    else {
        x1 = x; y1 = liquidHeight
        x2 = (canvasWidth - x); y2 = liquidHeight
        x3 = lastDrinkPoints[1].x; y3 = lastDrinkPoints[1].y
        x4 = lastDrinkPoints[0].x; y4 = lastDrinkPoints[0].y
        liquid.setAttribute("points", (x1 + "," + y1 + " ") + (x2 + "," + y2 + " ") + (x3 + "," + y3 + " ") + (x4 + "," + y4))
    }
    liquid.style.fill = "#" + color
    currDrinkPoints[0].x = x1; currDrinkPoints[0].y = y1
    currDrinkPoints[1].x = x2; currDrinkPoints[1].y = y2
    currDrinkPoints[2].x = x3; currDrinkPoints[2].y = y3
    currDrinkPoints[3].x = x4; currDrinkPoints[3].y = y4

    return currDrinkPoints
}

function resetInputs(bar) {
    let divDrinks = document.getElementById("divDrinks" + bar.id)
    let children = divDrinks.children;
    let inputNCName = document.getElementById("inputNCName" + bar.id)
    let inputNCPrice = document.getElementById("inputNCPrice" + bar.id)
    for (let i = 0; i < children.length; i++) {
        let input = children[i].childNodes[1];
        input.value = 0
    }
    inputNCName.value = ""
    inputNCPrice.value = 0
    document.getElementById("pNewCAmount" + bar.id).innerHTML = "Količina: 0ml/" + totalCocktailAmmount + "ml"
    document.getElementById("pNewCAlcPer" + bar.id).innerHTML = "Alkohol: 0%"
    document.getElementById("pNewCCost" + bar.id).innerHTML = "Cena pravljenja: 0 din."
    currCost = 0
}

function toogleInputs(bar, isDisabled) {
    let divDrinks = document.getElementById("divDrinks" + bar.id)
    let children = divDrinks.children;
    for (let i = 0; i < children.length; i++) {
        let input = children[i].childNodes[1];
        input.disabled = isDisabled
    }
}

function resetBar(bar) {
    bar.pouredDrinks = []
    bar.isMixed = false
    bar.currAmount = 0
    bar.drinks.forEach(e => {
        e.amount = 0
    })
}

function renderNewCocktail(bar, container) {
    let divNewCocktail = createEl("div", ["divNewCocktail", "flexContCol"])

    let glassSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    glassSvg.classList.add("glassSvg")
    glassSvg.id = "glassSvg" + bar.id
    glassSvg.setAttribute("height", canvasHeight)
    glassSvg.setAttribute("width", canvasWidth)

    let glass = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
    glass.classList.add("glass")
    glass.setAttribute("points", "0,0 " + (canvasWidth + ",0 ") + (p2 * canvasWidth + "," + canvasHeight) + " " +
        (p1 * canvasWidth + "," + canvasHeight) + " 0,0")
    glassSvg.appendChild(glass)

    let btnMix = createElWithInnerHtml("button", ["btnMix"], "Promešaj", "btnMix" + bar.id)
    btnMix.addEventListener("click", function () {
        let color = mixColors(bar.pouredDrinks)
        resetLiquid(bar)
        let liquid = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        liquid.classList.add("mixedLiquid")
        liquid.id = "mixedLiquid" + bar.id
        let amount = 0
        bar.pouredDrinks.forEach(el => {
            amount += el.amount
        });
        setLiquidPoints(canvasWidth, canvasHeight, amount, color, liquid, 0, [])
        glassSvg.appendChild(liquid)
        toogleInputs(bar, true)
        bar.isMixed = true
    })
    let btnReset = createElWithInnerHtml("button", ["btnReset"], "Resetuj")

    let inputNCName = createInput(["inputNCName"], "text", "inputNCName" + bar.id)
    let inputNCPrice = createInput(["inputNCPrice"], "number", "inputNCPrice" + bar.id)
    inputNCName.value = "koktel1"
    inputNCPrice.value = 500
    divNewCocktail.appendChild(createElWithInnerHtml("p", ["pNewCName"], "Ime koktela")) //CName cocktail name
    divNewCocktail.appendChild(inputNCName)
    divNewCocktail.appendChild(createElWithInnerHtml("p", ["pNewCPrice"], "Prodajna cena koktela"))
    divNewCocktail.appendChild(inputNCPrice)

    let divDrinkInfo = createEl("div", ["divDrinkInfo", "flexContRow"], "divDrinkInfo" + bar.id)
    divDrinkInfo.appendChild(createElWithInnerHtml("p", ["pNewCAmount"], "Količina: 0ml/" + totalCocktailAmmount + "ml", "pNewCAmount" + bar.id))
    divDrinkInfo.appendChild(createElWithInnerHtml("p", ["pNewCAlcPer"], "Alkohol: 0%", "pNewCAlcPer" + bar.id))
    divDrinkInfo.appendChild(createElWithInnerHtml("p", ["pNewCCost"], "Cena pravljenja: 0 din.", "pNewCCost" + bar.id))
    divNewCocktail.appendChild(divDrinkInfo)

    divNewCocktail.appendChild(glassSvg)
    divNewCocktail.appendChild(btnMix)
    btnReset.addEventListener("click", () => { resetInputs(bar); resetBar(bar); resetLiquid(bar); toogleInputs(bar, false) })
    divNewCocktail.appendChild(btnReset)
    let btnAddCocktail = createElWithInnerHtml("button", ["btnAddCocktail"], "Dodaj")
    btnAddCocktail.addEventListener("click", function (e) {
        e.preventDefault()
        let name = inputNCName.value
        let price = parseInt(inputNCPrice.value, 10)
        if (bar.currNum - bar.capacity == 0) {
            alert("Kapacitet bara je popunjen")
            return;
        }
        if (bar.currAmount == 0) {
            alert("Morate da unesete makar jedno piće")
            return
        }
        if (name.length < 3) {
            alert("Ime koktela mora imati više od 2 slova")
            return
        }
        if (name.length > 50) {
            alert("Ime bara mora biti manje od 50 karaktera")
            return;
        }
        if (price < 0) {
            alert("Cena mora biti veca od 0")
            return;
        }
        if(price - currCost < 0){
            alert("Prodajna cena koktela mora biti veća od cene pravljenja koktela!")
            return
        }
        let ingredients = []
        let tmpDrinks = []
        let amount = 0
        bar.drinks.forEach((e) => {
            if (e.amount != 0) {
                ingredients.push({
                    DrinkId: e.id,
                    Amount: e.amount
                })
                tmpDrinks.push({ amount: e.amount, drink: e })
                amount += e.amount
            }
        })
        fetch("https://localhost:5001/Bar/AddCocktail/" + amount + "/" + price, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                BarId: bar.id,
                Name: name,
                Mixed: bar.isMixed,
                Price: price,
                Ingredients: ingredients
            })
        }).then(r => {
            if (r.status == 200) {
                r.json().then(id => {
                    if(id == -1) {
                        alert("Poslati podaci nisu u odgovarajućem formatu");
                        return;
                    }
                    let cocktail = new Cocktail(id, bar.id, name, tmpDrinks, bar.isMixed, Math.round(price))
                    bars.find(e => e.id == bar.id).addCocktail(cocktail)
                    let divCocktailsCont = document.getElementById("divCocktailsCont" + bar.id)
                    cocktail.render(bar, divCocktailsCont, setLiquidPoints)
                    let divCocktailCounter = document.getElementById("divCocktailCounter" + bar.id)
                    divCocktailCounter.innerHTML = bar.currNum + "/" + bar.capacity

                    resetBar(bar)
                    resetInputs(bar)
                    resetLiquid(bar)
                    toogleInputs(bar, false)
                    alert("Uspesno ste dodali koktel");
                })
            }
        });
    })
    divNewCocktail.appendChild(btnAddCocktail)
    container.appendChild(divNewCocktail)
}

function renderCocktails(bar, container) {
    let divCocktails = createEl("div", ["divCocktails", "flexContCol"])
    let divCocktailsCont = createEl("div", ["divCocktailsCont", "flexContRow"])
    divCocktailsCont.id = "divCocktailsCont" + bar.id
    bar.cocktails.forEach((el, i) => {
        el.render(bar, divCocktailsCont, setLiquidPoints)
    })
    let divCocktailCounter = createElWithInnerHtml("div", ["divCocktailCounter"], bar.currNum + "/" + bar.capacity)
    divCocktailCounter.id = "divCocktailCounter" + bar.id
    let btnSell = createElWithInnerHtml("button", ["btnSell"], "Prodaj")
    btnSell.addEventListener("click", function () {
        if (bar.sCId == -1) {
            alert("Niste izabrali nijedan koktel")
            return
        }
        fetch("https://localhost:5001/Bar/RemoveCocktail/" + bar.sCId, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status == 204) {
                let sold = bar.removeCocktail(bar.sCId) //prodat koktel
                let domRemoved = document.getElementById("divCocktail" + bar.sCId)
                domRemoved.remove()
                let profit = parseInt(bar.profit + (sold.price - sold.cost), 10)
                divCocktailCounter.innerHTML = bar.currNum + "/" + bar.capacity
                fetch("https://localhost:5001/Bar/UpdateProfit/" + bar.id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: profit
                }).then(r => {
                    if (r.status == 204) {
                        bar.profit = profit
                        document.getElementById("pProfit" + bar.id).innerHTML = "Profit: " + profit + " din."
                        bar.sCId = -1
                    }
                });
            }
        });
    })
    divCocktails.appendChild(divCocktailsCont)
    divCocktails.appendChild(createElWithInnerHtml("p", ["pProfit"], "Profit: " + bar.profit + " din.", "pProfit" + bar.id))
    divCocktails.appendChild(divCocktailCounter)
    divCocktails.appendChild(btnSell)
    container.appendChild(divCocktails)
}

function resetLiquid(bar) {
    let p = document.getElementById("glassSvg" + bar.id);
    let glass = p.firstChild
    while (p.lastChild != glass) {
        p.removeChild(p.lastChild);
    }
}

function mixColors(drinks) {
    let r = 0, g = 0, b = 0
    let n = drinks.length
    drinks.forEach(e => {
        r += parseInt(e.color.substring(0, 2), 16);
        g += parseInt(e.color.substring(2, 4), 16);
        b += parseInt(e.color.substring(4, 6), 16);
    })
    r = Math.round(r / n).toString(16).length == 1 ? "0" + Math.round(r / n).toString(16) : Math.round(r / n).toString(16)
    g = Math.round(g / n).toString(16).length == 1 ? "0" + Math.round(g / n).toString(16) : Math.round(g / n).toString(16)
    b = Math.round(b / n).toString(16).length == 1 ? "0" + Math.round(b / n).toString(16) : Math.round(b / n).toString(16)
    return r + g + b
}

function onDrinkAmmountChange(drink, input) {
    let bar = bars.find(e => e.id == drink.barId)
    let newDrinkAmount = parseInt(input.value, 10)
    if (bar.currAmount + (newDrinkAmount - drink.amount) > totalCocktailAmmount) {
        input.value = drink.amount
    } else {
        drink.amount = newDrinkAmount
        if (!bar.pouredDrinks.find(e => e.id == drink.id)) {
            bar.pouredDrinks.push(drink)
        } else {
            let tmpDrink = bar.pouredDrinks.find(e => e.id == drink.id)
            tmpDrink.amount = newDrinkAmount
            if (tmpDrink.amount == 0) bar.pouredDrinks = bar.pouredDrinks.filter(e => e.id != drink.id)
        }
        bar.currAmount = 0
        let lastDrinkPoints = []
        let glassSvg = document.getElementById("glassSvg" + bar.id);
        resetLiquid(bar)
        let cost = 0, alcPer = 0
        bar.pouredDrinks.forEach((e, i) => {
            bar.currAmount += e.amount
            let liquid = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            liquid.classList.add("liquid")
            liquid.id = "liquid" + e.id
            lastDrinkPoints = setLiquidPoints(canvasWidth, canvasHeight, bar.currAmount, e.color, liquid, i, lastDrinkPoints)
            glassSvg.appendChild(liquid)

            cost += (e.amount / 1000) * e.price
            alcPer += (e.alcPer / 100) * e.amount
        })
        currCost = cost
        document.getElementById("pNewCAmount" + bar.id).innerHTML = "Količina: " + bar.currAmount + "ml/" + totalCocktailAmmount + "ml"
        document.getElementById("pNewCAlcPer" + bar.id).innerHTML = "Alkohol: " + ((alcPer / bar.currAmount) * 100).toFixed(2) + "%"
        document.getElementById("pNewCCost" + bar.id).innerHTML = "Cena pravljenja: " + Math.round(cost) + " din."
    }
}

async function getDrinks() {
    let r = await fetch("https://localhost:5001/Bar/GetDrinks/")
    let data = await r.json()
    data.forEach(e => {
        drinks.push(new Drink(e.id, e.name, e.alcPer, e.color, e.price));
    });
}

function renderBarAdding(container) {
    let divAddBar = createEl("div", ["divAddBar", "flexContCol"]);
    divAddBar.appendChild(createElWithInnerHtml("p", ["pNewBName"], "Ime bara")) //BName bar name
    let inputNBName = createInput(["inputNBName"], "text")
    divAddBar.appendChild(inputNBName)
    divAddBar.appendChild(createElWithInnerHtml("p", ["pNewBCapacity"], "Kapacitet bara"))
    let inputNBCapacity = createInput(["inputNBCapacity"], "number")
    divAddBar.appendChild(inputNBCapacity)
    let btnAddBar = createElWithInnerHtml("button", ["btnAddBar"], "Dodaj bar")
    btnAddBar.addEventListener("click", function (e) {
        e.preventDefault()
        let name = inputNBName.value
        let cap = parseInt(inputNBCapacity.value, 10)
        if (name.length < 2) {
            alert("Ime bara mora imati najmanje 2 slova")
            return
        }
        if (name.length > 50) {
            alert("Ime bara mora biti manje od 50 karaktera")
            return
        }
        if (cap < 0) {
            alert("Kapacitet mora biti veci od 0")
            return
        }
        fetch("https://localhost:5001/Bar/AddBar/", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: name,
                Capacity: cap
            })
        }).then(r => {
            if (r.status == 200) {
                r.json().then(id => {
                    let tmpDrinks = []
                    drinks.forEach(ed => {
                        tmpDrinks.push(new Drink(ed.id, ed.name, ed.alcPer, ed.color, ed.price, id))
                    })
                    let bar = new Bar(id, name, cap, [], 0, tmpDrinks)
                    bars.push(bar)
                    let divBars = document.getElementById("divBars");
                    renderBar(bar, divBars)

                    inputNBName.value = "";
                    inputNBCapacity.value = "";
                    alert("Uspesno ste dodali bar");
                })
            }
        });
    });
    divAddBar.appendChild(btnAddBar)
    container.appendChild(divAddBar)
}

async function getBars() {
    let r = await fetch("https://localhost:5001/Bar/GetBars/")
    let data = await r.json()
    data.forEach(eb => {
        let cocktails = []
        eb.cocktails.forEach((ce) => {
            let tmpDrinks = []
            ce.ingredients.forEach((ie) => {
                tmpDrinks.push({ amount: ie.amount, drink: drinks.find((de) => ie.drinkId == de.id) })
            })
            cocktails.push(new Cocktail(ce.id, ce.barId, ce.name, tmpDrinks, ce.mixed, ce.price))
        })
        let btmpDrinks = [] //b = bar
        drinks.forEach(ed => {
            btmpDrinks.push(new Drink(ed.id, ed.name, ed.alcPer, ed.color, ed.price, eb.id))
        })
        let bar = new Bar(eb.id, eb.name, eb.capacity, cocktails, eb.profit, btmpDrinks)
        bars.push(bar);
    });
}

async function render() {
    await getDrinks()
    await getBars()
    let divBars = createEl("div", ["flexContCol"], "divBars"); //bars container
    renderBarAdding(divBars)
    bars.forEach((el) => {
        renderBar(el, divBars)
    })
    document.body.appendChild(divBars)
}
