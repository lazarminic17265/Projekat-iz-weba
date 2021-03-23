using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models {
    public class Cocktail {
        [Key]
        public int Id { get; set; }

        public int BarId { get; set; }

        [StringLength(50, MinimumLength=3)]
        public string Name { get; set; }

        public bool Mixed { get; set; }

        public uint Price { get; set; }

        public virtual List<Ingredients> Ingredients { get; set; }
    }
}