using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace TaskAspNet.Business.Dtos;

public class MemberDto
{
    public int Id { get; set; } // Included for updates

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string? Phone { get; set; }

    [Required]
    public int JobTitleId { get; set; }
    public JobTitleDto? JobTitle { get; set; }
    public List<SelectListItem> AvailableJobTitles { get; set; } = new();

   [Required]
    [StringLength(200)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [StringLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    public int Day { get; set; }

    [Required]
    public int Month { get; set; }

    [Required]
    public int Year { get; set; }

    public DateTime DateOfBirth { get; set; }

    public UploadSelectImgDto ImageData { get; set; } = new UploadSelectImgDto();

    //public IFormFile? ProfileImageFile { get; set; }

    //public string? SelectedAvatar { get; set; }
}
