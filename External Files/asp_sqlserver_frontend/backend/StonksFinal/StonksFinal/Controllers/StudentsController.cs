using StudentDataAcceS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace StonksFinal.Controllers
{
    public class StudentsController : ApiController
    {
        public IEnumerable<Student1> Get()
        {
            using (StudentDetailsEntities1 entities1 = new StudentDetailsEntities1())
            {
                return entities1.Student1.ToList();
            }
        }

        public Student1 Get(int id)
        {
            using (StudentDetailsEntities1 entities1 = new StudentDetailsEntities1())
            {
                return entities1.Student1.FirstOrDefault(e => e.id == id);
            }
        }

        //This method will add a new Customer  
        public void POST(Student1 student)
        {
            using (StudentDetailsEntities1 entities1 = new StudentDetailsEntities1())
            {
                entities1.Student1.Add(student);
                entities1.SaveChanges();
            }
        }

        //This method to Update a Customer  
        public void PUT(int id, Student1 student)
        {
            using (StudentDetailsEntities1 entities1 = new StudentDetailsEntities1())
            {
                var customer1 = entities1.Student1.Find(id);
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
            using (StudentDetailsEntities1 entities1 = new StudentDetailsEntities1())
            {
                Student1 customer = entities1.Student1.Find(id);
                entities1.Student1.Remove(customer);
                entities1.SaveChanges();
                return "Student Deleted";
            }
        }


    }
}
