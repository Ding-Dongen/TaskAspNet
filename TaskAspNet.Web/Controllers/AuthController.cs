using System.Net;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using TaskAspNet.Business.Services;
using TaskAspNet.Data.Models;
using TaskAspNet.Business.Interfaces;
using TaskAspNet.Business.Dtos;

namespace TaskAspNet.Web.Controllers
{
    public class AuthController : Controller
    {
        private readonly UserService _userService;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMemberService _memberService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AuthController(
            UserService userService,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IMemberService memberService,
            IWebHostEnvironment webHostEnvironment)
        {
            _userService = userService;
            _signInManager = signInManager;
            _userManager = userManager;
            _memberService = memberService;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult CreateAcc()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateAcc(UserRegistrationForm model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            try
            {
                var result = await _userService.CreateUserAsync(model);
                if (result)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    if (user != null)
                    {
                        await _signInManager.SignInAsync(user, isPersistent: false);
                        return RedirectToAction("CreateMember", "Member", new { 
                            fullName = model.FullName,
                            email = model.Email,
                            userId = user.Id
                        });
                    }
                }
                
                ModelState.AddModelError("", "Failed to create user account.");
                return View(model);
            }
            catch (InvalidOperationException ex)
            {
                ModelState.AddModelError("", ex.Message);
                return View(model);
            }
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
