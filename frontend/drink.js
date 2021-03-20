import { createEl,  createElWithInnerHtml, createInput } from "./functions.js"

export class Drink{
    
    constructor(id, name, alcPer, color, price, barId){
        this.id = id
        this.name = name
        this.alcPer = alcPer //alcohol percentage
        this.color = color
        this.price = price

        this.amount = 0
        this.barId = barId
    }

    render(container, onChange){
        let divDrink = createEl("div", ["divDrink", "flexContCol"])
        divDrink.appendChild(createElWithInnerHtml("p", [], this.name + " (u ml)"))
        let inputDrinkAm = createInput(["inputDrinkAm"], "number")
        inputDrinkAm.min = 0
        inputDrinkAm.max = 1000
        inputDrinkAm.size = 10
        inputDrinkAm.step = 10
        inputDrinkAm.value = 0
        inputDrinkAm.addEventListener("input", (e) => {
            onChange(this, inputDrinkAm)
        })
        divDrink.appendChild(inputDrinkAm)
        container.appendChild(divDrink)
    }
}