using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ynomrah.Web.Controllers
{
    public class JonasController : Controller
    {
        public ActionResult ListOfCountries()
        {
            ViewBag.Countries = new List<string>()
            {
                "Canada",
                "Turkey",
                "USA",
                "Thailand",
                "Australia"
            };

            return View();
        }
    }
}