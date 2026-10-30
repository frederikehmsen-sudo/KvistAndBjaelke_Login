using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Service.DTOs;
using Service.Security;

namespace Service.Implementation;

public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher) : IUserService
{
    public List<UserResponse> GetUsers(Role role) =>
        userRepository.GetAll()
            .Where(u =>
                role == Role.Admin ||
                (role == Role.User && u.Role == Role.User) ||
                (role == Role.SuperUser &&
                 (u.Role == Role.User || u.Role == Role.SuperUser))
            )
            .Select(u => new UserResponse(u.Id, u.Username, u.Role.ToString()))
            .ToList();
}