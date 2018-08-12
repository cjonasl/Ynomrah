using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StructureMap;

namespace StructureMap.youtube_video_nr1
{
    public class Person
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public static class Test1
    {
        public static Action _action1 = Jonas;
        public static Action<Person> _action2 = Daniel;

        public static void Run()
        {
            var application = new Container();
            application.Configure(x => x.For<InstanceScanner>());
            application.Configure(x => x.For<ILogger>().Use<Logger>());

            Manager managerInstance = application.GetInstance<Manager>();
            Jonas jonasInstance = application.GetInstance<Jonas>();
            managerInstance.Writer();
            jonasInstance.Writer();
        }

        public static void Jonas()
        {
            Console.WriteLine("A message from method Jonas");
        }

        public static void Daniel(Person person)
        {
            Console.WriteLine(string.Format("First name = {0}, Last name = {1}", person.FirstName, person.LastName));
        }
    }
}
