using TaskAspNet.Data.Entities;
using TaskAspNet.Business.Dtos;
using System.Linq;

namespace TaskAspNet.Business.Factories
{
    public static class MemberFactory
    {
        public static MemberEntity CreateEntity(MemberDto dto)
        {
            var dateOfBirth = new DateTime(dto.Year, dto.Month, dto.Day);

            string profileImageUrl = null!;
            if (!string.IsNullOrEmpty(dto.ImageData?.SelectedImage))
            {
                profileImageUrl = $"/images/membericon/{dto.ImageData.SelectedImage}";
            }
            else if (!string.IsNullOrEmpty(dto.ImageData?.CurrentImage))
            {
                profileImageUrl = dto.ImageData.CurrentImage;
            }

            // ✅ Convert from DTO -> Entity
            return new MemberEntity
            {
                Id = dto.Id, // if updating
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                JobTitleId = dto.JobTitleId,
                DateOfBirth = dateOfBirth,
                ProfileImageUrl = profileImageUrl,
                UserId = dto.UserId,

                // Convert addresses
                Addresses = dto.Addresses.Select(a => new MemberAddressEntity
                {
                    Id = a.Id,  // for updating
                    Address = a.Address,
                    ZipCode = a.ZipCode,
                    City = a.City,
                    AddressType = a.AddressType
                }).ToList(),

                // Convert phones
                Phones = dto.Phones.Select(p => new MemberPhoneEntity
                {
                    Id = p.Id, // for updating
                    Phone = p.Phone,
                    PhoneType = p.PhoneType
                }).ToList()
            };
        }

        public static MemberDto CreateDto(MemberEntity entity)
        {
            // ✅ Convert from Entity -> DTO
            return new MemberDto
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                JobTitleId = entity.JobTitleId,
                JobTitle = entity.JobTitle != null
                    ? new JobTitleDto { Id = entity.JobTitle.Id, Title = entity.JobTitle.Title }
                    : null,

                DateOfBirth = entity.DateOfBirth,
                Day = entity.DateOfBirth.Day,
                Month = entity.DateOfBirth.Month,
                Year = entity.DateOfBirth.Year,
                ProfileImageUrl = entity.ProfileImageUrl,
                UserId = entity.UserId,

                ImageData = new UploadSelectImgDto
                {
                    CurrentImage = entity.ProfileImageUrl
                },

                // Convert entity addresses
                Addresses = entity.Addresses?.Select(a => new MemberAddressDto
                {
                    Id = a.Id,
                    Address = a.Address,
                    ZipCode = a.ZipCode,
                    City = a.City,
                    AddressType = a.AddressType,
                    MemberId = entity.Id
                }).ToList() ?? new List<MemberAddressDto>(),

                // Convert entity phones
                Phones = entity.Phones?.Select(p => new MemberPhoneDto
                {
                    Id = p.Id,
                    Phone = p.Phone,
                    PhoneType = p.PhoneType,
                    MemberId = entity.Id
                }).ToList() ?? new List<MemberPhoneDto>()
            };
        }
    }
}
