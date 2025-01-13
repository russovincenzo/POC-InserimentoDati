using System.Text;
using Microsoft.EntityFrameworkCore;

namespace POC_InserimentoDati.SoftwareApi.Data;

public class SoftwareDbContext(DbContextOptions<SoftwareDbContext> options) : DbContext(options)
{
    public DbSet<SoftwareModel> Softwares { get; init; }
}

public static class ConnectionStringBuilder
{
    public static string BuildConnectionString(this IConfiguration configuration)
    {
        var connectionString = configuration["CONNECTION_STRING"]
                               ?? configuration.GetConnectionString("DefaultConnection")
                               ?? throw new InvalidConfigurationException("CONNECTION_STRING");

        var builder = new StringBuilder(connectionString);
        builder.Replace(ConnectionStringChunks.DbServerName.ToPlaceHolder(),
                        Environment.GetEnvironmentVariable(ConnectionStringChunks.DbServerName)
                        ?? configuration[nameof(ConnectionStringChunks.DbServerName)]);
        builder.Replace(ConnectionStringChunks.DbName.ToPlaceHolder(),
                        Environment.GetEnvironmentVariable(ConnectionStringChunks.DbName)
                        ?? configuration[nameof(ConnectionStringChunks.DbName)]);
        builder.Replace(ConnectionStringChunks.DbUsername.ToPlaceHolder(),
                        Environment.GetEnvironmentVariable(ConnectionStringChunks.DbUsername)
                        ?? configuration[nameof(ConnectionStringChunks.DbUsername)]);
        builder.Replace(ConnectionStringChunks.DbPassword.ToPlaceHolder(),
                        Environment.GetEnvironmentVariable(ConnectionStringChunks.DbPassword)
                        ?? configuration[nameof(ConnectionStringChunks.DbPassword)]);

        return builder.ToString();
    }
}

public static class ConnectionStringChunks
{
    public const string DbServerName = "DB_SERVER_NAME";
    public const string DbName = "DB_NAME";
    public const string DbUsername = "DB_USERNAME";
    public const string DbPassword = "DB_PASSWORD";
}

public static class ConnectionStringPlaceholderExtension
{
    public static string ToPlaceHolder(this string chunk)
    {
        return $"{{{chunk}}}";
    }
}
