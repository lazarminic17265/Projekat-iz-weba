using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Web;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BarController : ControllerBase
    {
        public BarContext Context { get; set; }
        public BarController(BarContext context)
        {
            Context = context;
        }

        [HttpPost]
        [Route("AddCocktail/{amount}/{cost}")]
        public async Task<ActionResult<int>> AddCocktail(int amount, int cost, [FromBody] Cocktail c) {
            Bar b = await Context.Bar.Include(b => b.Cocktails).FirstOrDefaultAsync(b => b.Id == c.BarId);
            if (b.Cocktails.Count == b.Capacity || c.Ingredients.Count == 0 || c.Price - cost < 0 || amount > 250) {
                return StatusCode(400);
            }
            Context.Cocktail.Add(c);
            await Context.SaveChangesAsync();
            return c.Id;
        }
        
        [HttpPost]
        [Route("AddBar")]
        public async Task<int> AddBar([FromBody] Bar b) {
            Context.Bar.Add(b);
            await Context.SaveChangesAsync();
            return b.Id;
        }

        [HttpDelete]
        [Route("RemoveCocktail/{id}")]
        public async Task<IActionResult> RemoveCocktail(int id) {
            Cocktail c = await Context.Cocktail.Include(b => b.Ingredients).FirstOrDefaultAsync(c => c.Id == id);
            if (c == null) return StatusCode(404);
            Context.Cocktail.Remove(c);
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpPut]
        [Route("UpdateProfit/{id}")]
        public async Task<IActionResult> UpdateProfit(int id, [FromBody] uint profit) {
            Bar b = await Context.Bar.FindAsync(id);
            if (b == null) return StatusCode(404);
            b.Profit = profit;
            await Context.SaveChangesAsync();
            return StatusCode(204);
        }

        [HttpGet]
        [Route("GetBars")]
        public IEnumerable<Bar> GetBars() {
            List<Bar> bars = Context.Bar.Include(b => b.Cocktails).ThenInclude(c => c.Ingredients).ToList();
            return bars;
        }

        [HttpGet]
        [Route("GetDrinks")]
        public IEnumerable<Drink> GetDrinks() {
            List<Drink> drinks = Context.Drink.ToList();
            return drinks;
        }
    }
}
