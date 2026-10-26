using Infrastructure.Entities;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Service.DTOs;
using Service.Security;

namespace Service.Implementation;

public class UserService(IUserRepository userRepository, IPasswordHasher passwordHasher) : IUserService
{
    public User? TryLogin(TryLogin user)
    {
        var dbUser = userRepository.GetUserByUsername(user.Username);
        if(dbUser == null)
        {
            return null;
        }
        return passwordHasher.VerifyPassword(user.Password, dbUser.Password)
            ? dbUser
            : null;
    }

    public void TryRegister(CreateUserRequest user)
    {
        string passwordHash = passwordHasher.HashAndSaltPassword(user.Password);
        userRepository.CreateUser(new User
        {
            Username = user.Username,
            Password = passwordHash,
            Role = Role.User
        });
    }

    public List<User> GetUsers()
    {
        return userRepository.GetAll();
    }
}