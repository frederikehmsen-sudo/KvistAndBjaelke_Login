using Infrastructure.Entities;

namespace Infrastructure.Repositories;

public interface IUserRepository
{
    public User? GetUserByUsername(string username);
    public bool CreateUser(User user);
    public User? GetById(int id);
    public void DeleteUser(User user);
    public List<User> GetAll();
}