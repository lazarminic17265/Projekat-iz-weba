using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend.Models {
    public class Bar {
        [Key]
        public int Id { get; set; }
        
        [StringLength(50, MinimumLength=2)]
        public string Name { get; set; }

        public virtual List<Cocktail> Cocktails { get; set; }

        public uint Profit { get; set; }

        public uint Capacity { get; set; }
    }
}