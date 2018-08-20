using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.IO;
using System.Web.Mvc;
using Ynomrah.Web.Models;

namespace Ynomrah.Web.Controllers
{
    public class HomeController : Controller
    {
        public JsonResult GetPerson()
        {
            Person person = new Person()
            {
                FirstName = "Jonas",
                LastName = "Leander",
                Age = 48
            };

            return new JsonResult() { Data = person, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public ActionResult EchoPerson(string firstName, string lastName, int age)
        {
            Person person = new Person()
            {
                FirstName = firstName,
                LastName = lastName,
                Age = age
            };

            return View("EchoPerson", person);
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //From: https://stackoverflow.com/questions/18248547/get-controller-and-action-name-from-within-controller
            var actionName = filterContext.ActionDescriptor.ActionName;
            var controllerName = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;

            FileStream fileStream = new FileStream("C:\\tmp\\ActionNameControllerName.txt", FileMode.Append, FileAccess.Write);
            StreamWriter streamWriter = new StreamWriter(fileStream, Encoding.UTF8);
            streamWriter.WriteLine(string.Format("Request (Controller,Action)=({0},{1})", controllerName, actionName));
            streamWriter.Flush();
            fileStream.Flush();
            streamWriter.Close();
            fileStream.Close();
        }
    }   
}