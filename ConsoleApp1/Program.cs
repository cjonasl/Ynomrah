using System;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1
{
    class Program
    {
        static void Main(string[] args)
        {
            SqlConnection sqlConnection = new SqlConnection("Data Source=LAPTOP-I366KH96;Initial Catalog=Harmony;Integrated Security=True;MultipleActiveResultSets=true;Async=true;");
            SqlCommand sqlCommand = new SqlCommand("SELECT Email FROM [User]", sqlConnection);
            sqlConnection.Open();
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();

            while(sqlDataReader.Read())
            {
                Console.WriteLine(sqlDataReader[0].ToString());
            }

            sqlConnection.Close();
        }
    }
}
