using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskAspNet.Data.Entities;

public class ClientEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string ClientName { get; set; } = string.Empty;

    
    public List<ProjectEntity> Projects { get; set; } = new();
}
