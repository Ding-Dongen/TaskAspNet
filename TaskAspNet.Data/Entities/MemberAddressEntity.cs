using System.ComponentModel.DataAnnotations;

namespace TaskAspNet.Data.Entities
{
    public class MemberAddressEntity
    {
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string Address { get; set; } = string.Empty;

        [Required, StringLength(10)]
        public string ZipCode { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string City { get; set; } = string.Empty;

        [StringLength(50)]
        public string AddressType { get; set; } = "Home";

        // Foreign Key
        public int MemberId { get; set; }
        public MemberEntity Member { get; set; } = null!;
    }
}
