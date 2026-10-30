using System.Text.Json.Serialization;
using Infrastructure;
using Infrastructure.DataAccess;
using Service;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddScoped<API.Data.Seeder>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.ConfigureInfrastructureServices(
    builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=app.db");
var jwtSecret = builder.Configuration["JwtSecret"];
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
{
    throw new InvalidOperationException("JwtSecret must be configured and at least 32 characters");
}
builder.Services.ConfigureDomainServices(jwtSecret);
builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddCors(s => s.AddPolicy("CorsPolicy", t => t.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

var app = builder.Build();
app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.MapGet("/", () => Results.Redirect("/swagger"));
}


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    scope.ServiceProvider.GetRequiredService<API.Data.Seeder>().Seed();
}

app.MapControllers();
app.Run();