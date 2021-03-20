using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models {
    public class Drink {
        [Key]
        public int Id { get; set; }
        
        public string Name { get; set; }

        [Range(0, 100)]
        public int AlcPer { get; set; }
        
        [StringLength(6, MinimumLength=6)]
        public string Color { get; set; }

        public uint Price { get; set; }

        public virtual List<Ingredients> Ingredients { get; set; }
    }
}