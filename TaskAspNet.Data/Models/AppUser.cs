

using Microsoft.AspNetCore.Identity;
using TaskAspNet.Data.Entities;

namespace TaskAspNet.Data.Models;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
}
