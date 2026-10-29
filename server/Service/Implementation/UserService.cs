using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Service.DTOs;
using Service.Security;

namespace Service.Implementation;

public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher) : IUserService
{

    public List<User> GetUsers()
    {
        return userRepository.GetAll();
    }
}