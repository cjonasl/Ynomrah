using System;

namespace hiJump.Infrastructure.DB.Entity
{
    public interface IEntity
    {
        int Version { get; set; }
        Guid ID { get; set; }
        string UpdatedBy { get; set; }
        DateTime? UpdatedDate { get; set; }
        string AddedBy { get; set; }
        DateTime? AddedDate { get; set; }
    }
}
