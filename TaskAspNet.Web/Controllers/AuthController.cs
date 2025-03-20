using System.Net;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using TaskAspNet.Business.Services;
using TaskAspNet.Data.Models;

namespace TaskAspNet.Web.Controllers
{
    
    public class AuthController(UserService userService, SignInManager<AppUser> signInManager, UserManager<AppUser> userManager) : Controller
    {
        private readonly UserService _userService = userService;
        private readonly SignInManager<AppUser> _signInManager = signInManager;
        private readonly UserManager<AppUser> _userManager = userManager;

        public IActionResult CreateAcc()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateAcc(UserRegistrationForm form)
        {
            if (!ModelState.IsValid)
            return View(form);

            var result = await _userService.CreateUserAsync(form);

            if (result)
            {
                var user = await _userManager.FindByEmailAsync(form.Email);
                if (user != null) {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    return RedirectToAction("Members", "Admin");
                }
            }
            ModelState.AddModelError("", "User was not created.");
            return View(form);
            
        }

        public IActionResult LogIn(string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> LogIn(UserLogInForm form, string? returnUrl = null)
        {
            if (!ModelState.IsValid)
            {
                ViewData["Error"] = "Invalid login attempt.";
                return View(form);
            }

            var result = await _signInManager.PasswordSignInAsync(form.Email, form.Password, false, false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(form.Email);
                var roles = await _userManager.GetRolesAsync(user);

                var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email)
        };

                
                claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

                var claimsIdentity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
                var principal = new ClaimsPrincipal(claimsIdentity);

               
                await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
                await HttpContext.SignInAsync(IdentityConstants.ApplicationScheme, principal);

                if (roles.Contains("SuperAdmin"))
                {
                    return RedirectToAction("ManageUsers", "Admin");
                }
                else if (roles.Contains("Admin"))
                {
                    return RedirectToAction("Members", "Admin");
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }
            }

            ModelState.AddModelError("", "Invalid login attempt.");
            return View(form);
        }

        [Authorize]
        public async Task<IActionResult> LogOut()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("LogIn", "Auth");
        }
    }
}
