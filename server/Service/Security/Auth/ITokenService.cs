using Infrastructure.Entities;

namespace Service.Security.Auth;

public interface ITokenService
{
    public string GenerateToken(User user);
}