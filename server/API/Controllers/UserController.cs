using System.Security.Claims;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Implementation;

namespace API.Controllers;

[Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    private Role ActorRole =>
        Enum.Parse<Role>(User.FindFirstValue(ClaimTypes.Role)!);
    
    [Authorize]
    [HttpGet]
    public List<UserResponse> GetAll()
    {
        return userService.GetUsers(ActorRole);
    }
}