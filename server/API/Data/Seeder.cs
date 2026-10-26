using Infrastructure.Entities;
using Infrastructure.Repositories;
using Service.Security;

namespace API.Data;
public class Seeder(IUserRepository userRepository, IPasswordHasher passwordHasher, IConfiguration configuration)
{
    public void Seed()
    {
        SeedUser("user", "Seed:UserPassword", Role.User);
        SeedUser("superuser", "Seed:SuperUserPassword", Role.SuperUser);
        SeedUser("admin", "Seed:AdminPassword", Role.Admin);
    }

    private void SeedUser(string username, string passwordConfigKey, Role role)
    {
        var password = configuration[passwordConfigKey];
        if (string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        userRepository.CreateUser(new User
        {
            Username = username,
            Password = passwordHasher.HashAndSaltPassword(password),
            Role = role
        });
    }
}