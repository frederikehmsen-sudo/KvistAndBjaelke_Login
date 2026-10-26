using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs;
using Service.Implementation;
using Service.Security.Auth;

namespace API.Controllers;

public class LoginController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ITokenService _tokenService;

    public LoginController(IUserService userService, ITokenService tokenService)
    {
        _userService = userService;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("/login")]
    public IActionResult Login([FromBody] TryLogin tryLogin)
    {
        var user = _userService.TryLogin(tryLogin);
        if (user == null)
        {
            return Unauthorized();
        }

        var token = _tokenService.GenerateToken(user);
        return Ok(new { token });
    }

    [AllowAnonymous]
    [HttpPost("/register")]
    public void Create([FromBody] CreateUserRequest createUserRequest)
    {
        _userService.TryRegister(createUserRequest);
    }
}