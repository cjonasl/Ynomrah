using System;
using hiJump.Infrastructure.DataAccess.EventListeners;
using hiJump.Infrastructure.Helpers;
using NHibernate;
using NHibernate.Proxy;
using hiJump.Infrastructure.ReusableEntities.Rules.PropertyNavigator;
using NHibernate.Proxy.DynamicProxy;

namespace hiJump.Infrastructure.DB.Entity
{
    [Serializable]
    public abstract class EntityBase : IEntityBase
    {
        public static string PROPERTYIDNAME = "ID";

        protected EntityBase()
        {
            ID = GuidHelpers.GenerateSequentialGuid();
        }

        [DoNotAudit]
        [DoNotIncludeInPropertyNavigator]
        public virtual int Version { get; set; }

        [DoNotAudit]
        public virtual Guid ID { get; set; }

        [DoNotAudit]
        [DoNotIncludeInPropertyNavigator]
        public virtual string UpdatedBy { get; set; }

        [DoNotAudit]
        [DoNotIncludeInPropertyNavigator]
        public virtual DateTime? UpdatedDate { get; set; }

        [DoNotAudit]
        [DoNotIncludeInPropertyNavigator]
        public virtual string AddedBy { get; set; }

        [DoNotAudit]
        public virtual DateTime? AddedDate { get; set; }

        [DoNotIncludeInPropertyNavigator]
        public virtual bool HasBeenPersisted
        {
            get
            {
                return Version != default(int);
            }
        }

        public override string ToString()
        {
            if (this is IHaveName)
                return ((IHaveName)this).Name;

            if (this is IHaveDescription)
                return ((IHaveDescription)this).Description;

            return base.ToString();
        }

        #region Equality Tests

        /// <summary>
        /// Determines whether the specified entity is equal to the 
        /// current instance.
        /// </summary>
        /// <param name="entity">An <see cref="System.Object"/> that 
        /// will be compared to the current instance.</param>
        /// <returns>True if the passed in entity is equal to the 
        /// current instance.</returns>
        public override bool Equals(object entity)
        {
            return entity != null
                   && entity is EntityBase
                   && this == (EntityBase)entity;
        }

        /// <summary>
        /// Operator overload for determining equality.
        /// </summary>
        /// <param name="base1">The first instance of an 
        /// <see cref="EntityBase"/>.</param>
        /// <param name="base2">The second instance of an 
        /// <see cref="EntityBase"/>.</param>
        /// <returns>True if equal.</returns>
        public static bool operator ==(EntityBase base1,
                                       EntityBase base2)
        {
            // check for both null (cast to object or recursive loop)
            if ((object)base1 == null && (object)base2 == null)
            {
                return true;
            }

            // check for either of them == to null
            if ((object)base1 == null || (object)base2 == null)
            {
                return false;
            }

            if (base1.ID != base2.ID)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Operator overload for determining inequality.
        /// </summary>
        /// <param name="base1">The first instance of an 
        /// <see cref="EntityBase"/>.</param>
        /// <param name="base2">The second instance of an 
        /// <see cref="EntityBase"/>.</param>
        /// <returns>True if not equal.</returns>
        public static bool operator !=(EntityBase base1,
                                       EntityBase base2)
        {
            return (!(base1 == base2));
        }

        /// <summary>
        /// Serves as a hash function for this type.
        /// </summary>
        /// <returns>A hash code for the current Key 
        /// property.</returns>
        public override int GetHashCode()
        {
            return this.ID.GetHashCode();
        }

        #endregion

        public virtual Type GetUnproxiedType()
        {
            return GetUnproxiedType(this);
        }

        public static Type GetUnproxiedType(object entity)
        {
            if (entity is IProxy)
                return entity.GetType().BaseType;
            else
                return entity.GetType();
        }

    }

    public interface IEntityBase : IHaveAnId
    {

    }

    public static class EntityBaseExtension
    {
        public static bool Is<T>(this object entity)
        {
            if (entity == null)
                return false;

            var proxy = entity as INHibernateProxy;
            if (proxy != null)
                return typeof(T).IsAssignableFrom(NHibernateUtil.GetClass(entity));

            return entity is T;
        }

        public static T As<T>(this object entity) where T : class
        {
            if (entity == null)
                return default(T);

            var proxy = entity as INHibernateProxy;

            if (proxy != null)
            {
                return proxy.HibernateLazyInitializer.GetImplementation() as T;
            }
            else
            {
                return entity as T;
            }
        }

    }
}