using Service.DTOs;

namespace Service.Implementation;

public interface IAuthService
{
    LoginResponse? Login(LoginRequest request);
}