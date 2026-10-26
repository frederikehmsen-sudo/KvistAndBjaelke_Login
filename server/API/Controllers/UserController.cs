using Infrastructure.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Implementation;

namespace API.Controllers;

[Microsoft.AspNetCore.Components.Route("api/[controller]")]
public class UserController(IUserService userService) : ControllerBase
{
    [Authorize]
    [HttpGet]
    public ActionResult<List<User>> GetAll()
    {
        try
        {
            return Ok(userService.GetUsers());
        }
        catch (Exception e)
        {
            return BadRequest("Could not get users");
        }
    }
}