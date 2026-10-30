using Infrastructure.Entities;
using Service.DTOs;

namespace Service.Implementation;

public interface IUserService
{
    List<UserResponse> GetUsers(Role role);
    UserResponse CreateUser(Role actorRole, CreateUserRequest request);
}