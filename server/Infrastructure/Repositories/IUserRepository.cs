using Infrastructure.Entities;

namespace Infrastructure.Repositories;

public interface IUserRepository
{
    public User? GetUserByUsername(string username);
    public void CreateUser(User user);
    public List<User> GetAll();
}