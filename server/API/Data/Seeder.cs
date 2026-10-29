using Infrastructure.Entities;
using Infrastructure.Repositories;
using Service.Security;

namespace API.Data;

public class Seeder(IUserRepository userRepository, IPasswordHasher passwordHasher)
{
    public void Seed()
    {
        SeedUser("user", "user123", Role.User);
        SeedUser("superuser", "superuser123", Role.SuperUser);
        SeedUser("admin", "admin123", Role.Admin);
    }

    private void SeedUser(string username, string password, Role role)
    {
        userRepository.CreateUser(new User
        {
            Username = username,
            Password = passwordHasher.HashAndSaltPassword(password),
            Role = role
        });
    }
}