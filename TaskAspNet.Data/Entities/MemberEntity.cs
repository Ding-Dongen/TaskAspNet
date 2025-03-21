using System.ComponentModel.DataAnnotations;

namespace TaskAspNet.Data.Entities
{
    public class MemberEntity
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public int JobTitleId { get; set; }
        public JobTitleEntity JobTitle { get; set; } = null!;

        [Required, DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        public string? ProfileImageUrl { get; set; }
        public string UserId { get; set; } = string.Empty;

        // ✅ Multiple addresses instead of a single "Address"
        public List<MemberAddressEntity> Addresses { get; set; } = new List<MemberAddressEntity>();

        // ✅ Multiple phones instead of a single "Phone"
        public List<MemberPhoneEntity> Phones { get; set; } = new List<MemberPhoneEntity>();

        // Example: If you also keep project membership
        public List<ProjectMemberEntity> ProjectMembers { get; set; } = new();
    }
}



//using System.ComponentModel.DataAnnotations;


//namespace TaskAspNet.Data.Entities;

//public class MemberEntity
//{
//    public int Id { get; set; }

//    [Required]
//    [StringLength(50)]
//    public string FirstName { get; set; } = string.Empty;

//    [Required]
//    [StringLength(50)]
//    public string LastName { get; set; } = string.Empty;

//    [Required]
//    [EmailAddress]
//    [StringLength(100)]
//    public string Email { get; set; } = string.Empty;

//    [Required]
//    public int JobTitleId { get; set; }

//    public JobTitleEntity JobTitle { get; set; } = null!;

//    [Required]
//    [DataType(DataType.Date)]
//    public DateTime DateOfBirth { get; set; }

//    public string? ProfileImageUrl { get; set; }

//    public List<ProjectMemberEntity> ProjectMembers { get; set; } = new();

//    public List<MemberPhoneEntity> Phones { get; set; } = new();

//    public List<MemberAddressEntity> Addresses { get; set; } = new();

//    public string UserId { get; set; } = string.Empty;


//}
