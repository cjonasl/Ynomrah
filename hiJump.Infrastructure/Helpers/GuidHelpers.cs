using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;

namespace hiJump.Infrastructure.Helpers
{
    public static class GuidHelpers
    {
        //TODO: The Sequential Guid
        [DllImport("rpcrt4.dll", SetLastError = true)]
        static extern int UuidCreateSequential(out Guid guid);

        public static List<Guid> FromCommaSeperatedString(string theString)
        {
            if (string.IsNullOrEmpty(theString))
                return new List<Guid>();

            var lst = theString.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            return (
                    from l in lst
                    select new Guid(l)
                ).ToList();
        }

        public static bool IsAGuid(this object value)
        {
            if (value is Guid)
                return true;

            // Otherwise try to parse
            Guid g = Guid.Empty;
            try
            {
                g = new Guid(value.ToString());
            }
            catch (FormatException)
            {
                return false;
            }
            return true;
        }

        public static Guid GenerateSequentialGuid()
        {
            const int RPC_S_OK = 0;
            Guid g;
            return UuidCreateSequential(out g) != RPC_S_OK ? Guid.NewGuid() : g;
        }

        public static bool IsNullOrEmpty(this Guid? guid)
        {
            return guid == null || guid.Value == Guid.Empty;
        }

        public static bool IsNullOrEmpty(this Guid guid)
        {
            return guid == null || guid == Guid.Empty;
        }

        public static bool IsEmpty(this Guid guid)
        {
            return guid == Guid.Empty;
        }

        public static Guid ValueOrEmptyGuid(this Guid? val)
        {
            return val.HasValue ? val.Value : Guid.Empty;
        }
    }
}