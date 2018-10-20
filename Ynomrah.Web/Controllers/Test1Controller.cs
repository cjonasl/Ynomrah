using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ynomrah.Web.Controllers
{
    public class AAA
    {
        public static string str1 = "<h1>Hello</h1>";

        public override string ToString()
        {
            return "<p>Jag heter Jonas</p>";
        }
    }

    public class BBB
    {
        public void Write()
        {
            AAA aaa = new AAA();
            HttpContext.Current.Response.Write(aaa);
        }
    }

    public class Resource
    {
        public string Title { get; set; }
        public string Text { get; set; }
    }


    public class Test1Controller : Controller
    {
        // GET: Test1
        public ActionResult Index()
        {
            return View();
        }

        [ValidateInput(false)]
        public JsonResult TestAjax(Resource resource)
        {
            string str = "Server received title = " + resource.Title + " and text = " + resource.Text;

            return Json(str, JsonRequestBehavior.AllowGet);
        }
    }
}