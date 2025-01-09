using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using POC_InserimentoDati;
using POC_InserimentoDati.SoftwareApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<SoftwareDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();

// Servire i file statici
app.UseStaticFiles(); // Abilita la distribuzione dei file statici dalla cartella "wwwroot"

// Imposta una route di fallback per servire "index.html"
app.MapFallbackToFile("index.html");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.MapGet("/software", ([FromServices] SoftwareDbContext context) =>
{
    return context.Softwares.ToListAsync();
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

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<SoftwareDbContext>();
    dbContext.Database.EnsureCreated();
}

app.Run();