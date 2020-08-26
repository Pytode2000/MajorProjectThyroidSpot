using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class diagnosisController : ApiController
    {
        //get all patient's diagnosis (get specific done in js)
        public IEnumerable<diagnosis> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.diagnosis.ToList();
            }
        }


        //get patient diagnosis via patient id
        public IEnumerable<diagnosis> Get(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.diagnosis.Where(s => s.patient_id == id).ToList();
            }
        }


        //add patient diagnosis (done when patient signs up)
        public void POST(diagnosis diagnose)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.diagnosis.Add(diagnose);
                entities.SaveChanges();
            }
        }

        //update diagnosis
        public void PUT(int id, diagnosis pinfo)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var patientinfo = entities.diagnosis.FirstOrDefault(e => e.diagnosis_id == id);
                patientinfo.patient_id = pinfo.patient_id;
                patientinfo.diagnosis1= pinfo.diagnosis1;
                


                entities.Entry(patientinfo).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete diagnosis by diagnosis_id
        public  string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                diagnosis infoid = entities.diagnosis.Find(id);
                entities.diagnosis.Remove(infoid);
                entities.SaveChanges();
                return "Patient info deleted";
            }
        }


        //delete diagnosis by patient_id (TESTED SUCCESSFUL)
        public string DeleteByPatient(int patientid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                var infoids = entities.diagnosis.Where(w => w.patient_id == patientid);

                foreach (diagnosis infoid in infoids)
                {
                    entities.diagnosis.Remove(infoid);
                }
                entities.SaveChanges();
                return "Diagnosis deleted";
            }
        }
    }
}
