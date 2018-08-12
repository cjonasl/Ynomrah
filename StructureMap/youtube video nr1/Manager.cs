using System;

namespace StructureMap.youtube_video_nr1
{
    public class Manager
    {
        private readonly ILogger _logger;

        public Manager(ILogger logger)
        {
            _logger = logger;
        }

        public void Writer()
        {
            _logger.WriteHerePlease("Good morning! I love you!");
        }
    }
}
