
using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;

namespace TaskAspNet.Data.Models;

public class UserLogInForm
{
    
    [Required]
    [Display(Name = "Email Address", Prompt = "Enter your email address")]
    [DataType(DataType.EmailAddress)]
    public string Email { get; set; } = null!;
    [Required]
    [Display(Name = "Password", Prompt = "Enter your password")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = null!;
   
}
