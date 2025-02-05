using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC_InserimentoDati;
using POC_InserimentoDati.SoftwareApi.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

builder.Services.AddHttpLogging(o =>
{
    o.LoggingFields = Microsoft.AspNetCore.HttpLogging.HttpLoggingFields.All;
});
builder.Logging.SetMinimumLevel(LogLevel.Trace);
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDirectoryBrowser();
builder.Services.AddDbContext<SoftwareDbContext>(options => options.UseNpgsql(builder.Configuration.BuildConnectionString()));
var app = builder.Build();

// Servire i file statici
// app.UseStaticFiles(); // Abilita la distribuzione dei file statici dalla cartella "wwwroot"
// Imposta una route di fallback per servire "index.html"
// app.UseDirectoryBrowser();
// app.MapFallbackToFile("index.html");
app.UseFileServer(enableDirectoryBrowsing: false);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
    app.UseHttpLogging();
}

app.MapGet("/software", async (string query, [FromServices] SoftwareDbContext context) =>
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Results.Ok(await context.Softwares.ToListAsync());
        }

        var results = await context.Softwares
            .Where(s =>
                (s.SoftwareId != null && EF.Functions.ILike(s.SoftwareId, $"%{query}%")) ||
                (s.Name != null && EF.Functions.ILike(s.Name, $"%{query}%")) ||
                (s.Manufacturer != null && EF.Functions.ILike(s.Manufacturer, $"%{query}%")) ||
                (s.Website != null && EF.Functions.ILike(s.Website, $"%{query}%")) ||
                (s.License != null && EF.Functions.ILike(s.License, $"%{query}%")) ||
                (s.Version != null && EF.Functions.ILike(s.Version, $"%{query}%")) ||
                (s.ProgrammingLanguage != null && EF.Functions.ILike(s.ProgrammingLanguage, $"%{query}%")) ||
                (s.HardwareSpecifications != null && EF.Functions.ILike(s.HardwareSpecifications, $"%{query}%")) ||
                (s.SoftwareSpecifications != null && EF.Functions.ILike(s.SoftwareSpecifications, $"%{query}%")) ||
                (s.Function != null && EF.Functions.ILike(s.Function, $"%{query}%")))
            .ToListAsync();

        return Results.Ok(results);
    })
    .WithOpenApi();


app.MapGet("/software/{id:int}", async (int id, [FromServices] SoftwareDbContext context) =>
{
    var software = await context.Softwares.FindAsync(id);
    return software == null ? Results.NotFound() : Results.Ok(software);
})
.WithName("GetSoftwareById")
.WithOpenApi();

app.MapPost("/software", async (SoftwareModel model, [FromServices] SoftwareDbContext context) =>
    {
        context.Softwares.Add(model);
        await context.SaveChangesAsync();
        return Results.CreatedAtRoute("GetSoftwareById", new { id = model.Id }, model);
    })
    .WithOpenApi();

app.MapPut("/software/{id:int}", async (int id, SoftwareModel model, [FromServices] SoftwareDbContext context) =>
    {
        if (id != model.Id)
        {
            return Results.BadRequest("ID mismatch");
        }
        context.Entry(model).State = EntityState.Modified;
        await context.SaveChangesAsync();
        return Results.NoContent();
    })
    .WithOpenApi();

app.MapDelete("/software/{id:int}", async (int id, [FromServices] SoftwareDbContext context) =>
    {
        var software = await context.Softwares.FindAsync(id);
        if (software == null)
        {
            return Results.NotFound();
        }

        context.Softwares.Remove(software);
        await context.SaveChangesAsync();

        return Results.NoContent();
    })
    .WithOpenApi();

app.MapGet("/units", async (string query, [FromServices] SoftwareDbContext context) =>
    {
        var units = await context.Softwares
            .Where(s => s.Units.Contains(query))
            .Select(s => s.Units)
            .Distinct()
            .ToListAsync();
        return Results.Ok(units);
    })
    .WithOpenApi();


using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SoftwareDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();
