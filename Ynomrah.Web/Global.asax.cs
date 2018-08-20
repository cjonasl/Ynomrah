using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Ynomrah.Web
{
    /// <summary>
    /// A stream which keeps an in-memory copy as it passes the bytes through
    /// From: https://stackoverflow.com/questions/1038466/logging-raw-http-request-response-in-asp-net-mvc-iis7
    /// </summary>
    public class OutputFilterStream : Stream
    {
        private readonly Stream InnerStream;
        private readonly MemoryStream CopyStream;

        public OutputFilterStream(Stream inner)
        {
            this.InnerStream = inner;
            this.CopyStream = new MemoryStream();
        }

        public string ReadStream()
        {
            lock (this.InnerStream)
            {
                if (this.CopyStream.Length <= 0L ||
                    !this.CopyStream.CanRead ||
                    !this.CopyStream.CanSeek)
                {
                    return String.Empty;
                }

                long pos = this.CopyStream.Position;
                this.CopyStream.Position = 0L;
                try
                {
                    return new StreamReader(this.CopyStream).ReadToEnd();
                }
                finally
                {
                    try
                    {
                        this.CopyStream.Position = pos;
                    }
                    catch { }
                }
            }
        }


        public override bool CanRead
        {
            get { return this.InnerStream.CanRead; }
        }

        public override bool CanSeek
        {
            get { return this.InnerStream.CanSeek; }
        }

        public override bool CanWrite
        {
            get { return this.InnerStream.CanWrite; }
        }

        public override void Flush()
        {
            this.InnerStream.Flush();
        }

        public override long Length
        {
            get { return this.InnerStream.Length; }
        }

        public override long Position
        {
            get { return this.InnerStream.Position; }
            set { this.CopyStream.Position = this.InnerStream.Position = value; }
        }

        public override int Read(byte[] buffer, int offset, int count)
        {
            return this.InnerStream.Read(buffer, offset, count);
        }

        public override long Seek(long offset, SeekOrigin origin)
        {
            this.CopyStream.Seek(offset, origin);
            return this.InnerStream.Seek(offset, origin);
        }

        public override void SetLength(long value)
        {
            this.CopyStream.SetLength(value);
            this.InnerStream.SetLength(value);
        }

        public override void Write(byte[] buffer, int offset, int count)
        {
            this.CopyStream.Write(buffer, offset, count);
            this.InnerStream.Write(buffer, offset, count);
        }
    }

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Application_BeginRequest()
        {
            HttpResponse response = HttpContext.Current.Response;
            OutputFilterStream filter = new OutputFilterStream(response.Filter);
            response.Filter = filter;
            this.Context.Items["filter"] = filter;
        }

        protected void Application_EndRequest()
        {
            OutputFilterStream filter =  (OutputFilterStream)this.Context.Items["filter"];
            string result = filter.ReadStream();

            FileStream fileStream = new FileStream("C:\\tmp\\RequestResult.txt", FileMode.Append, FileAccess.Write);
            StreamWriter streamWriter = new StreamWriter(fileStream, Encoding.UTF8);
            streamWriter.WriteLine(result);
            streamWriter.Flush();
            fileStream.Flush();
            streamWriter.Close();
            fileStream.Close();
        }
    }
}
