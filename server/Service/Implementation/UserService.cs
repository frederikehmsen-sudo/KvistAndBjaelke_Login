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

    public UserResponse CreateUser(Role actorRole, CreateUserRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Username and password are required.");

        if (!CanCreate(actorRole, request.Role))
            throw new UnauthorizedAccessException("You are not allowed to create this role.");

        var user = new User
        {
            Username = request.Username,
            Password = passwordHasher.HashAndSaltPassword(request.Password),
            Role = request.Role
        };

        if (!userRepository.CreateUser(user))
            throw new InvalidOperationException("Username already exists.");

        return new UserResponse(user.Id, user.Username, user.Role.ToString());
    }
    private static bool CanCreate(Role actor, Role target) => actor switch
    {
        Role.Admin => true,
        Role.SuperUser => target == Role.User,
        _ => false
    };
    public void DeleteUser(Role actorRole, int actorId, int targetId)
    {
        var target = userRepository.GetById(targetId)
                     ?? throw new KeyNotFoundException("User not found.");

        if (target.Id == actorId)
            throw new InvalidOperationException("You cannot delete yourself.");

        if (!CanDelete(actorRole, target.Role))
            throw new UnauthorizedAccessException("You are not allowed to delete this role.");

        userRepository.DeleteUser(target);
    }

    private static bool CanDelete(Role actor, Role target) => actor switch
    {
        Role.Admin => true,
        Role.SuperUser => target == Role.User,
        _ => false
    };
    
    public UserResponse UpdateUser(Role actorRole, int actorId, int targetId, UpdateUserRequest request)
    {
        var target = userRepository.GetById(targetId)
                     ?? throw new KeyNotFoundException("User not found.");

        if (string.IsNullOrWhiteSpace(request.Username))
            throw new ArgumentException("Username is required.");
        
        if (!CanUpdate(actorRole, target.Role))
            throw new UnauthorizedAccessException("You are not allowed to edit this user.");

        var newRole = request.Role ?? target.Role;
        
        if (!CanUpdate(actorRole, newRole))
            throw new UnauthorizedAccessException("You are not allowed to assign this role.");
        
        if (target.Id == actorId && newRole != target.Role)
            throw new InvalidOperationException("You cannot change your own role.");

        var existing = userRepository.GetUserByUsername(request.Username);
        if (existing != null && existing.Id != target.Id)
            throw new InvalidOperationException("Username already exists.");

        target.Username = request.Username;
        target.Role = newRole;

        if (!string.IsNullOrWhiteSpace(request.Password))
            target.Password = passwordHasher.HashAndSaltPassword(request.Password);

        userRepository.UpdateUser(target);

        return new UserResponse(target.Id, target.Username, target.Role.ToString());
    }

    private static bool CanUpdate(Role actor, Role target) => actor switch
    {
        Role.Admin => true,
        Role.SuperUser => target == Role.User,
        _ => false
    };
}