using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StructureMap.youtube_video_nr1
{
    public interface ILogger
    {
        void WriteHerePlease(string text);
    }

    public class Logger : ILogger
    {
        public void WriteHerePlease(string text)
        {
            Console.WriteLine(text);
            Console.WriteLine("Bye from method StructureMap.youtube_video_nr1.Logger.WriteHerePlease!");
        }
    }
}
