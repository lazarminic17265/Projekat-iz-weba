export class Bar{
    constructor(id, name, capacity, cocktails, profit, drinks){
        this.id = id
        this.name = name
        this.cocktails = cocktails
        this.profit = profit
        this.capacity = capacity
        this.currNum = cocktails.length //current number koktela
        this.drinks = drinks

        this.currAmount = 0
        this.sCId = -1 //sc = selected cocktail
        this.pouredDrinks = []
        this.isMixed = false
    }

    addCocktail(c){
        this.cocktails.push(c)
        this.currNum++;
    }

    removeCocktail(id){
        let that = this
        let removed = {}
        this.cocktails = this.cocktails.filter(el => {
            if(el.id == that.sCId) { removed = el; return false; }
            return true
        })
        this.currNum--;
        return removed
    }

}