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

    [Authorize(Roles = "Admin,SuperUser")]
    [HttpPost]
    public IActionResult CreateUser([FromBody] CreateUserRequest request)
    {
        try
        {
            var created = userService.CreateUser(ActorRole, request);
            return StatusCode(StatusCodes.Status201Created, created);
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (InvalidOperationException) { return Conflict("Username already exists."); }
        catch (ArgumentException e) { return BadRequest(e.Message); }
    }
    
    private int ActorId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [Authorize(Roles = "Admin,SuperUser")]
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        try
        {
            userService.DeleteUser(ActorRole, ActorId, id);
            return NoContent();
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (InvalidOperationException e) { return BadRequest(e.Message); }
    }
    
    [Authorize(Roles = "Admin,SuperUser")]
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var updated = userService.UpdateUser(ActorRole, ActorId, id, request);
            return Ok(updated);
        }
        catch (UnauthorizedAccessException) { return Forbid(); }
        catch (KeyNotFoundException) { return NotFound(); }
        catch (InvalidOperationException e) { return Conflict(e.Message); }
        catch (ArgumentException e) { return BadRequest(e.Message); }
    }
}