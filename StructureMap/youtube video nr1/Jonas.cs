using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StructureMap.youtube_video_nr1
{
    public class Jonas
    {
        private int _n;

        public Jonas()
        {
            _n = 5;
        }

        public void Writer()
        {
            Console.WriteLine(string.Format("Class Jonas store the integer {0}", _n.ToString()));
        }
    }
}
