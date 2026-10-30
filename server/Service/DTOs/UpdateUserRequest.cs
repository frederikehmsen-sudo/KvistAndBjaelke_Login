using Infrastructure.Entities;

namespace Service.DTOs;

public class UpdateUserRequest
{
    public string Username { get; set; }
    public string? Password { get; set; }
    public Role? Role { get; set; }
}