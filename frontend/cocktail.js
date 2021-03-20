import { createEl,  createElWithInnerHtml } from "./functions.js"

export class Cocktail{
    constructor(id, barId, name, drinks, isMixed, price){
        this.id = id
        this.barId = barId
        this.name = name
        this.drinks = drinks //amount u ml
        this.isMixed = isMixed
        this.price = price
        
        let cost = 0, amount = 0, alcPer = 0
        drinks.forEach(el => {
            amount += el.amount
            cost += (el.amount/1000) * el.drink.price
            alcPer +=  (el.drink.alcPer/100) * el.amount
        });
        if(isMixed){
            this.color = this.mixColors(this.drinks)
        } else {
            this.color = ""
        }
        this.cost = Math.round(cost)
        this.amount = amount
        this.alcPer = alcPer/amount*100 //alcohol percentage
    }

    render(bar, container, setLiquidPoints){
        let canvasHeight = 100
        let canvasWidth = 60
        let divCocktail = createEl("div", ["divCocktail", "flexContCol"], "divCocktail" + this.id)
        let that = this
        divCocktail.addEventListener("click", function(){
            if(bar.sCId == -1){
                divCocktail.style.background = "grey"
                bar.sCId = that.id
            }
            else if(bar.sCId != -1 && bar.sCId == that.id){
                divCocktail.style.background = "none"
                bar.sCId = -1
            } else if (bar.sCId != -1 && bar.sCId != that.id) {
                let lastClickedCocktail = document.getElementById("divCocktail" + bar.sCId)
                lastClickedCocktail.style.background = "none"
                divCocktail.style.background = "grey"
                bar.sCId = that.id
            }
        })

        let glassSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        glassSvg.classList.add("cocktailGlass")
        glassSvg.setAttribute("height", canvasHeight)
        glassSvg.setAttribute("width", canvasWidth)

        let glass = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        glass.classList.add("glass")
        glass.setAttribute("points", "0,0 " + (canvasWidth + ",0 ") + (0.85 * canvasWidth + "," + canvasHeight) + " " +
            (0.15 * canvasWidth + "," + canvasHeight) + " 0,0")
        glassSvg.appendChild(glass)

        if(this.isMixed){
            let liquid = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            liquid.classList.add("liquid")
            setLiquidPoints(canvasWidth, canvasHeight, this.amount, this.color, liquid)
            glassSvg.appendChild(liquid)
        } else {
            let lastDrinkPoints = []
            let tmpAmount = 0
            this.drinks.forEach((e, i) => {
                tmpAmount += e.amount
                let liquid = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                liquid.classList.add("liquid")
                lastDrinkPoints = setLiquidPoints(canvasWidth, canvasHeight, tmpAmount, e.drink.color, liquid, i, lastDrinkPoints)
                glassSvg.appendChild(liquid)
            })
        }
        
        divCocktail.appendChild(glassSvg)
        divCocktail.appendChild(createElWithInnerHtml("p", ["pCocktailInfo"], "Naziv: " + this.name))
        divCocktail.appendChild(createElWithInnerHtml("p", ["pCocktailInfo"], "Procenat alkohola: " + this.alcPer.toFixed(2) + "%"))
        divCocktail.appendChild(createElWithInnerHtml("p", ["pCocktailInfo"], "Zarada: " + Math.round(this.price - this.cost) + " din."))
        container.appendChild(divCocktail)
    }

    mixColors(){
        let r = 0,g = 0, b = 0
        let n = this.drinks.length
        this.drinks.forEach(e=>{
            r += parseInt(e.drink.color.substring(0,2), 16);
            g += parseInt(e.drink.color.substring(2,4), 16);
            b += parseInt(e.drink.color.substring(4,6), 16);
        })
        r = Math.round(r/n).toString(16).length == 1 ? "0" + Math.round(r/n).toString(16) : Math.round(r/n).toString(16)
        g = Math.round(g/n).toString(16).length == 1 ? "0" + Math.round(g/n).toString(16) : Math.round(g/n).toString(16)
        b = Math.round(b/n).toString(16).length == 1 ? "0" + Math.round(b/n).toString(16) : Math.round(b/n).toString(16)
        return r + g + b 
    }
}