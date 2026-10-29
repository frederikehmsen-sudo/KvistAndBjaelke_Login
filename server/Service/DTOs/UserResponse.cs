using System.Runtime.InteropServices;
using Infrastructure.Entities;

namespace Service.DTOs;

public record UserResponse(int Id, string Username, string Role);