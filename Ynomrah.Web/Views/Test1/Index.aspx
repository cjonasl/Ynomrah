 <%@ Page Language="C#" Inherits="System.Web.Mvc.ViewPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
 <%=Ynomrah.Web.Controllers.AAA.str1%>
 <%:Ynomrah.Web.Controllers.AAA.str1%>
 <% Ynomrah.Web.Controllers.BBB bbb = new Ynomrah.Web.Controllers.BBB(); bbb.Write(); %>
</body>
</html>
