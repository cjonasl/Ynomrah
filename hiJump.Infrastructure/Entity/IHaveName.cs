
namespace hiJump.Infrastructure.DB.Entity
{
    public interface IHaveName : IHaveAnId
    {
        string Name { get; }
    }

}
