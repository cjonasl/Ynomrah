using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Ynomrah.Web.Controllers
{
    public class SudokuController : Controller
    {
        public ActionResult New()
        {
            return View();
        }

        public ActionResult Old()
        {
            return View();
        }
    }
}