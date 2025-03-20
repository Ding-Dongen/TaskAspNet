using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskAspNet.Data.Models;

namespace TaskAspNet.Data.Entities;

public class MemberEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty; 

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty; 

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty; 

    [Required]
    [Phone]
    [StringLength(20)]
    public string Phone { get; set; } = string.Empty; 

    [Required]
    public int JobTitleId { get; set; }

    public JobTitleEntity JobTitle { get; set; } = null!;

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
    [DataType(DataType.Date)]
    public DateTime DateOfBirth { get; set; }

    public string? ProfileImageUrl { get; set; } 

    public List<ProjectMemberEntity> ProjectMembers { get; set; } = new();


}
