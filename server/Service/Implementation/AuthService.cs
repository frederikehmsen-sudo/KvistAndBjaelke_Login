using Infrastructure.Repositories;
using Service.DTOs;
using Service.Security;
using Service.Security.Auth;

namespace Service.Implementation;

public class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IAuthService
{
    public LoginResponse? Login(LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            return null;

        var user = userRepository.GetUserByUsername(request.Username);
        if (user == null) return null;

        if (!passwordHasher.VerifyPassword(request.Password, user.Password))
            return null;

        return new LoginResponse(tokenService.GenerateToken(user), user.Role.ToString());
    }
}