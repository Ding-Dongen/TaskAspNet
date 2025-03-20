using TaskAspNet.Data.Entities;
using TaskAspNet.Business.Dtos;
using Microsoft.VisualBasic;
using Microsoft.AspNetCore.Identity;

namespace TaskAspNet.Business.Factories
{
    public static class MemberFactory
    {
        public static MemberEntity CreateEntity(MemberDto dto)
        {
            
            var DateOfBirth = new DateTime(dto.Year, dto.Month, dto.Day);

           
            string profileImageUrl = null!;
            if (!string.IsNullOrEmpty(dto.ImageData?.SelectedImage))
            {
                profileImageUrl = $"/images/membericon/{dto.ImageData.SelectedImage}";
            }
            else if (!string.IsNullOrEmpty(dto.ImageData?.CurrentImage))
            {
                profileImageUrl = dto.ImageData.CurrentImage;
            }

            return new MemberEntity
            {
               
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone ?? "",
                JobTitleId = dto.JobTitleId,
                Address = dto.Address,
                ZipCode = dto.ZipCode,
                City = dto.City,
                DateOfBirth = DateOfBirth,
                ProfileImageUrl = profileImageUrl
            };
        }

        public static MemberDto CreateDto(MemberEntity entity)
        {
            return new MemberDto
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                LastName = entity.LastName,
                Email = entity.Email,
                Phone = entity.Phone,
                JobTitleId = entity.JobTitleId,
                JobTitle = entity.JobTitle != null ? new JobTitleDto { Id = entity.JobTitle.Id, Title = entity.JobTitle.Title } : null,
                Address = entity.Address,
                ZipCode = entity.ZipCode,
                City = entity.City,
                DateOfBirth = entity.DateOfBirth,
                Day = entity.DateOfBirth.Day, 
                Month = entity.DateOfBirth.Month, 
                Year = entity.DateOfBirth.Year, 
                ImageData = new UploadSelectImgDto
                {
                    CurrentImage = entity.ProfileImageUrl
                }
                //SelectedAvatar = entity.ProfileImageUrl ?? "default-avatar.png"
            };
        }
    }
}
