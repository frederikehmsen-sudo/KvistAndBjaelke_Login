using Infrastructure.Entities;
using Service.DTOs;

namespace Service.Implementation;

public interface IUserService
{
    List<User> GetUsers();
}