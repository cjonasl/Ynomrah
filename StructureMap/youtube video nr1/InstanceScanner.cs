using StructureMap.Configuration.DSL;

namespace StructureMap.youtube_video_nr1
{
    public class InstanceScanner : Registry
    {
        public InstanceScanner()
        {
            Scan(x =>
            {
                x.TheCallingAssembly();
                x.WithDefaultConventions();
            });
        }
    }
}
