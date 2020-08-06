using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StudentDataAccess;

namespace StudentServices.Controllers
{
    public class StudentsController : ApiController
    {
        public IEnumerable<StudentsTable> Get()
        {
            using (StudentDetailsAzureEntities entities1 = new StudentDetailsAzureEntities())
            {
                return entities1.StudentsTables.ToList();
            }
        }

        public StudentsTable Get(int id)
        {
            using (StudentDetailsAzureEntities entities1 = new StudentDetailsAzureEntities())
            {
                return entities1.StudentsTables.FirstOrDefault(e => e.id == id);
            }
        }

        //This method will add a new Customer  
        public void POST(StudentsTable student)
        {
            using (StudentDetailsAzureEntities entities1 = new StudentDetailsAzureEntities())
            {
                entities1.StudentsTables.Add(student);
                entities1.SaveChanges();
            }
        }

        //This method to Update a Customer  
        public void PUT(int id, StudentsTable student)
        {
            using (StudentDetailsAzureEntities entities1 = new StudentDetailsAzureEntities())
            {
                var customer1 = entities1.StudentsTables.Find(id);
                customer1.studentName = student.studentName;
                customer1.studentClass = student.studentClass;
                customer1.studentCourse = student.studentCourse;
                entities1.Entry(customer1).State = System.Data.Entity.EntityState.Modified;
                entities1.SaveChanges();
            }
        }

        //This method will delete a customer  
        public string Delete(int id)
        {
            using (StudentDetailsAzureEntities entities1 = new StudentDetailsAzureEntities())
            {
                StudentsTable customer = entities1.StudentsTables.Find(id);
                entities1.StudentsTables.Remove(customer);
                entities1.SaveChanges();
                return "Student Deleted";
            }
        }

    }

}
