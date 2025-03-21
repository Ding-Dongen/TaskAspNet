using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskAspNet.Data.Models;
using TaskAspNet.Business.Dtos;

namespace TaskAspNet.Business.Interfaces
{
    public interface IUserService
    {
        Task<bool> CreateUserAsync(UserRegistrationForm form);
        Task<bool> DeleteUserAsync(string userId);
    }
} 