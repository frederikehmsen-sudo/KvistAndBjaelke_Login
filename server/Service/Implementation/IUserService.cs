using Infrastructure.Entities;
using Service.DTOs;

namespace Service.Implementation;

public interface IUserService
{
    User? TryLogin(TryLogin user);
    void TryRegister(CreateUserRequest user);
    List<User> GetUsers();
}