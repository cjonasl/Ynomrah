using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace hiJump.Infrastructure.ReusableEntities.Rules.PropertyNavigator
{
    public class PropertyNavigatorValue
    {
        public PropertyNavigatorValue()
        {
            Properties = new List<PropertyNavigatorProperty>();
        }

        public List<PropertyNavigatorProperty> Properties { get; set; }
    }


    public class PropertyNavigatorProperty
    {
        public string Name { get; set; }
        public string Label { get; set; }
    }
}
