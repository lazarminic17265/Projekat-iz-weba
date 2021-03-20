using Microsoft.EntityFrameworkCore;

namespace backend.Models {
    public class BarContext : DbContext {
        
        public DbSet<Drink> Drink { get; set; }
        public DbSet<Cocktail> Cocktail { get; set; }
        public DbSet<Bar> Bar { get; set; }
        public DbSet<Ingredients> Ingredients { get; set; }

        public BarContext(DbContextOptions options) : base(options) {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Ingredients>()
                .HasKey(o => new { o.CocktailId, o.DrinkId });
        }
    }
}