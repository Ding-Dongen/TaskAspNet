using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskAspNet.Business.Interfaces;
using TaskAspNet.Business.Services;
using TaskAspNet.Data.Context;
using TaskAspNet.Data.Interfaces;
using TaskAspNet.Data.Repositories;
using TaskAspNet.Data.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IMemberService, MemberService>();

builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IMemberRepository, MemberRepository>();
builder.Services.AddScoped<IClientRepository, ClientRepository>();
builder.Services.AddScoped<IProjectStatusRepository, ProjectStatusRepository>();

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<RoleService>();


builder.Services.AddLogging(logging =>
{
    logging.AddConsole(); 
    logging.AddDebug();   
});

builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection")));

builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<UserDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.WebHost.UseWebRoot("wwwroot");


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    string[] roleNames = { "SuperAdmin", "Admin", "User" };

    foreach (var role in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    
    string superAdminEmail = "superadmin@example.com";
    string superAdminPassword = "SuperAdmin123!";

    var superAdmin = await userManager.FindByEmailAsync(superAdminEmail);
    if (superAdmin == null)
    {
        var newSuperAdmin = new AppUser
        {
            UserName = superAdminEmail,
            Email = superAdminEmail,
            EmailConfirmed = true,
            FirstName = "Super",
            LastName = "Admin"
        };

        var result = await userManager.CreateAsync(newSuperAdmin, superAdminPassword);
        if (result.Succeeded)
        {
            if (!await userManager.IsInRoleAsync(newSuperAdmin, "SuperAdmin")) 
            {
                await userManager.AddToRoleAsync(newSuperAdmin, "SuperAdmin");
            }
        }
    }
    else
    {
        if (!await userManager.IsInRoleAsync(superAdmin, "SuperAdmin")) 
        {
            await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");
        }
    }
}

app.UseHsts();

app.UseStaticFiles();


app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Auth}/{action=LogIn}/{id?}")
    .WithStaticAssets();


app.Run();