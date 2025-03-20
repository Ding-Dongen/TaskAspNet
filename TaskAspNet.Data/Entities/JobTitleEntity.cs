using System.ComponentModel.DataAnnotations;

namespace TaskAspNet.Data.Entities;

public class JobTitleEntity
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty; 

    public List<MemberEntity> Member { get; set; } = new(); 
}
