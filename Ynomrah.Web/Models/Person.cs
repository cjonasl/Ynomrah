using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ynomrah.Web.Models
{
    public class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }

        public Person()
        {
            FirstName = "??";
            LastName = "??";
            Age = -1;
        }

        public Person(string firstName, string lastName, int age)
        {
            FirstName = firstName;
            LastName = lastName;
            Age = age;
        }
    }
}