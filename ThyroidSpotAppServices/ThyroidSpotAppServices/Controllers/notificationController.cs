using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class notificationController : ApiController
    {
        // GET all notification
        public IEnumerable<notification> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.notification.ToList();
            }
        }

        // Get notification by patient id
        public IEnumerable<notification> GetByPatientId(int patientid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.notification.Where(s => s.patient_id == patientid).ToList();
            }
        }

        // POST Notification
        public void POST(notification notifications)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                entities.notification.Add(notifications);


                entities.SaveChanges();
            }
        }
        // PUT Notification
        public void PUT(int id, notification notifications)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var updatedNotification = entities.notification.Find(id);
                updatedNotification.patient_id = notifications.patient_id;
                updatedNotification.notification_content = notifications.notification_content;
                updatedNotification.seen = notifications.seen;
                updatedNotification.timestamp = notifications.timestamp;

                entities.Entry(updatedNotification).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }


        // DELETE Notification by id
        public string DELETE(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                notification notifications = entities.notification.Find(id);
                entities.notification.Remove(notifications);
                entities.SaveChanges();
                return "Deleted Successfully";
            }
        }

        // DELETE by patient id
        public string DeleteByPatientId(int patientid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                var infoids = entities.notification.Where(w => w.patient_id == patientid);

                foreach (notification infoid in infoids)
                {
                    entities.notification.Remove(infoid);
                }
                entities.SaveChanges();
                return "Prescriptions deleted";
            }
        }
    }
}