namespace hiJump.Infrastructure.DB.Entity
{
    public interface IHaveDescription : IHaveAnId
    {
        string Description { get; }
    }
}