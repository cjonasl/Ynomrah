using System;

namespace hiJump.Infrastructure.DB.Entity
{
    public interface IHaveAnId
    {
        Guid ID { get; set; }
    }
}