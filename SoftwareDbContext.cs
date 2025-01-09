using Microsoft.EntityFrameworkCore;

namespace POC_InserimentoDati.SoftwareApi.Data;

public class SoftwareDbContext : DbContext
{
    public SoftwareDbContext(DbContextOptions<SoftwareDbContext> options)
        : base(options)
    {
    }

    public DbSet<SoftwareModel> Softwares { get; set; }
}