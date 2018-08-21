using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ynomrah.Web.Models;

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

        public PartialViewResult Paris(string firstName, string lastName, int age)
        {
            Person person = new Person(firstName, lastName, age);
            return PartialView(person);
        }

        public ActionResult Berlin(string firstName, string lastName, int age)
        {
            Person person = new Person(firstName, lastName, age);
            return View(person);
        }

        public ActionResult Milano()
        {
            return View();
        }
    }
}