using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using TaskAspNet.Business.Dtos;
using TaskAspNet.Business.Interfaces;
[Authorize]
[Route("[controller]")] 
public class MemberController : Controller
{
    private readonly IMemberService _memberService;
    private readonly IProjectService _projectService;
    private readonly IWebHostEnvironment _webHostEnvironment;

    public MemberController(IMemberService memberService, IProjectService projectService, IWebHostEnvironment webHostEnvironment)
    {
        _memberService = memberService;
        _projectService = projectService;
        _webHostEnvironment = webHostEnvironment;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("Search")]
    public async Task<IActionResult> Search(string term)
    {
        if (string.IsNullOrWhiteSpace(term))
            return Ok(new List<MemberDto>());

        var matches = await _memberService.SearchMembersAsync(term);
        return Ok(matches);
    }
    // AI
    [HttpGet("GetMembers")]
    public async Task<IActionResult> GetMembers([FromQuery] int projectId)
    {
        if (projectId <= 0)
        {
            Console.WriteLine("API ERROR: Invalid project ID received.");
            return BadRequest(new { error = "Invalid project ID" });
        }

        Console.WriteLine($"API: Fetching members for project ID: {projectId}");

        var members = await _projectService.GetProjectMembersAsync(projectId);
        if (members == null || !members.Any())
        {
            Console.WriteLine("No members found for this project.");
            return NotFound(new { error = "No members found for this project" });
        }

        Console.WriteLine($"Found {members.Count} members for project ID {projectId}");
        return Ok(members);
    }


    
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var members = await _memberService.GetAllMembersAsync();

        if (members == null || !members.Any())
        {
            return NotFound(new { error = "No members found." });
        }

        return Ok(members);
    }
    [Authorize(Roles = "Admin, SuperAdmin, User")]
    [HttpGet]
    public async Task<IActionResult> Create(string fullName = null, string email = null, string userId = null)
    {
        Console.WriteLine($"Create action called with: fullName={fullName}, email={email}, userId={userId}");
        
        var jobTitles = await _memberService.GetAllJobTitlesAsync();

        var model = new MemberDto
        {
            AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
            {
                Value = jt.Id.ToString(),
                Text = jt.Title
            }).ToList()
        };

        // If we have pre-filled data from user registration, use it
        if (!string.IsNullOrEmpty(fullName) && !string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(userId))
        {
            Console.WriteLine("Pre-filling form with user data");
            var names = fullName.Split(' ', 2);
            model.FirstName = names[0];
            model.LastName = names.Length > 1 ? names[1] : "";
            model.Email = email;
            model.UserId = userId;
            Console.WriteLine($"Pre-filled data: FirstName={model.FirstName}, LastName={model.LastName}, Email={model.Email}, UserId={model.UserId}");
        }

        return View("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", model);
    }
    [Authorize(Roles = "Admin, SuperAdmin, User")]
    [HttpPost("Create")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(MemberDto memberDto)
    {
        Console.WriteLine("Create action started");
        Console.WriteLine($"ModelState.IsValid: {ModelState.IsValid}");
        
        if (!ModelState.IsValid)
        {
            Console.WriteLine("Model validation failed");
            foreach (var modelError in ModelState.Values.SelectMany(v => v.Errors))
            {
                Console.WriteLine($"Validation error: {modelError.ErrorMessage}");
            }

            
            var jobTitles = await _memberService.GetAllJobTitlesAsync();
            memberDto.AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
            {
                Value = jt.Id.ToString(),
                Text = jt.Title
            }).ToList();

            return View("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
        }

        try
        {
            Console.WriteLine("Creating member with data:");
            Console.WriteLine($"FirstName: {memberDto.FirstName}");
            Console.WriteLine($"LastName: {memberDto.LastName}");
            Console.WriteLine($"Email: {memberDto.Email}");
            Console.WriteLine($"JobTitleId: {memberDto.JobTitleId}");

            memberDto.DateOfBirth = new DateTime(memberDto.Year, memberDto.Month, memberDto.Day);
            string imagePath = await HandleImageUploadAsync(memberDto.ImageData, "members");
            if (!string.IsNullOrEmpty(imagePath))
            {
                memberDto.ProfileImageUrl = imagePath;
                memberDto.ImageData.CurrentImage = imagePath;
            }

            var createdMember = await _memberService.AddMemberAsync(memberDto);
            if (createdMember == null)
            {
                Console.WriteLine("Failed to create member - AddMemberAsync returned null");
                ModelState.AddModelError("", "Error creating the member.");
                return View("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
            }

            Console.WriteLine("Member created successfully");
            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception occurred: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            ModelState.AddModelError("", "An error occurred while creating the member.");
            return View("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
        }
    }
    [Authorize]
    [HttpGet("")]  
    [HttpGet("Index")]  
    public async Task<IActionResult> Index()
    {
        var allMembers = (await _memberService.GetAllMembersAsync()).ToList();
        var jobTitles = await _memberService.GetAllJobTitlesAsync();

        var predefinedImagesFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "membericon");
        var imageFiles = Directory.GetFiles(predefinedImagesFolder)
                                  .Where(file => file.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase))
                                  .Select(Path.GetFileName)
                                  .Where(fileName => fileName != null)
                                  .Select(fileName => fileName!)
                                  .ToList();

        var model = new MemberIndexViewModel
        {
            AllMembers = allMembers,
            CreateMember = new MemberDto
            {
                ImageData = new UploadSelectImgDto
                {
                    PredefinedImages = imageFiles
                },
                AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
                {
                    Value = jt.Id.ToString(),
                    Text = jt.Title
                }).ToList()
            }
        };

        return View(model);
    }
    [Authorize]
    private async Task<string> HandleImageUploadAsync(UploadSelectImgDto imageData, string folderName)
    {
        if (imageData.UploadedImage != null)
        {
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), $"wwwroot/uploads/{folderName}");
            Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + imageData.UploadedImage.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageData.UploadedImage.CopyToAsync(stream);
            }

            return $"/uploads/{folderName}/" + uniqueFileName;
        }
        else if (!string.IsNullOrEmpty(imageData.SelectedImage))
        {
            return $"/images/{folderName}/" + imageData.SelectedImage;
        }

        return null!;
    }

    [Authorize(Roles = "Admin, SuperAdmin")]
    [HttpPost("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        var deletedMember = await _memberService.DeleteMemberAsync(id);
        if (deletedMember == null)
        {
            TempData["ErrorMessage"] = "Member not found or already deleted.";
            return RedirectToAction("Index");
        }

        TempData["SuccessMessage"] = $"Deleted member: {deletedMember.FirstName} {deletedMember.LastName}";
        return RedirectToAction("Index");
    }

    [Authorize(Roles = "Admin, SuperAdmin")]
    [HttpPost("Edit")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(MemberDto member)
    {
        if (!ModelState.IsValid)
        {
            var jobTitles = await _memberService.GetAllJobTitlesAsync();
            member.AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
            {
                Value = jt.Id.ToString(),
                Text = jt.Title
            }).ToList();

            return PartialView("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", member);
        }

        try
        {
            // Handle image upload
            string imagePath = await HandleImageUploadAsync(member.ImageData, "members");
            if (!string.IsNullOrEmpty(imagePath))
            {
                member.ProfileImageUrl = imagePath;
                member.ImageData.CurrentImage = imagePath;
            }

            var updatedMember = await _memberService.UpdateMemberAsync(member.Id, member);
            if (updatedMember == null)
            {
                return NotFound();
            }

            return RedirectToAction("Index");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception occurred during edit: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            ModelState.AddModelError("", "An error occurred while updating the member.");
            return PartialView("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", member);
        }
    }

    [Authorize]
    [HttpGet("CreateMember")]
    public async Task<IActionResult> CreateMember(string fullName, string email, string userId)
    {
        var jobTitles = await _memberService.GetAllJobTitlesAsync();
        var predefinedImagesFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images", "membericon");
        var imageFiles = Directory.GetFiles(predefinedImagesFolder)
                                  .Where(file => file.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)
                                              || file.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase))
                                  .Select(Path.GetFileName)
                                  .Where(fileName => fileName != null)
                                  .Select(fileName => fileName!)
                                  .ToList();

        var names = fullName.Split(' ', 2);
        var firstName = names[0];
        var lastName = names.Length > 1 ? names[1] : "";

        var model = new MemberDto
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            UserId = userId,
            AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
            {
                Value = jt.Id.ToString(),
                Text = jt.Title
            }).ToList(),
            ImageData = new UploadSelectImgDto
            {
                PredefinedImages = imageFiles
            }
        };

        return View("~/Views/Shared/Partials/Components/Member/_CreateMemberModal.cshtml", model);
    }

    [Authorize]
    [HttpPost("CreateMember")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateMember(MemberDto memberDto)
    {
        if (!ModelState.IsValid)
        {
            var jobTitles = await _memberService.GetAllJobTitlesAsync();
            memberDto.AvailableJobTitles = jobTitles.Select(jt => new SelectListItem
            {
                Value = jt.Id.ToString(),
                Text = jt.Title
            }).ToList();

            return PartialView("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
        }

        try
        {
            // Set default date if not provided
            if (memberDto.Year <= 0 || memberDto.Month <= 0 || memberDto.Day <= 0)
            {
                memberDto.DateOfBirth = DateTime.Now;
            }
            else
            {
                try
                {
                    memberDto.DateOfBirth = new DateTime(memberDto.Year, memberDto.Month, memberDto.Day);
                }
                catch (ArgumentOutOfRangeException)
                {
                    memberDto.DateOfBirth = DateTime.Now;
                }
            }

            // Handle image upload
            if (memberDto.ImageData != null)
            {
                string imagePath = await HandleImageUploadAsync(memberDto.ImageData, "members");
                if (!string.IsNullOrEmpty(imagePath))
                {
                    memberDto.ProfileImageUrl = imagePath;
                    memberDto.ImageData.CurrentImage = imagePath;
                }
            }

            var createdMember = await _memberService.AddMemberAsync(memberDto);
            if (createdMember == null)
            {
                ModelState.AddModelError("", "Error creating the member.");
                return PartialView("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
            }

            return RedirectToAction("Index", "Member");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception occurred: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            ModelState.AddModelError("", "An error occurred while creating the member.");
            return PartialView("~/Views/Shared/Partials/Components/Member/_CreateEditMember.cshtml", memberDto);
        }
    }
}
