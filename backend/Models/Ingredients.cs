using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models {
    public class Ingredients {
        public int CocktailId { get; set; }
        public int DrinkId { get; set; }
        public uint Amount { get; set; }
    }
}