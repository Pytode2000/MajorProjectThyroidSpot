using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class reportController : ApiController
    {
        //get all patient reports (can be used for doctor-only accs)
        public IEnumerable<patient_report> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_report.ToList();
            }
        }

        //get one patient report (can be used for patient-only accs)
        public patient_report Get(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_report.FirstOrDefault(e => e.report_id == id);
            }
        }

        //Get report by patient id
        public IEnumerable<patient_report> GetByPatient(int patientid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_report.Where(s => s.patient_id == patientid).ToList();
            }
        }

        //add new patient report
        public void POST(patient_report report)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.patient_report.Add(report);
                //entities.SaveChanges();
                try
                {
                    entities.SaveChanges();
                }
                catch (System.Data.Entity.Validation.DbEntityValidationException dbEx)
                {
                    Exception raise = dbEx;
                    foreach (var validationErrors in dbEx.EntityValidationErrors)
                    {
                        foreach (var validationError in validationErrors.ValidationErrors)
                        {
                            string message = string.Format("{0}:{1}",
                                validationErrors.Entry.Entity.ToString(),
                                validationError.ErrorMessage);
                            // raise a new exception nesting
                            // the current instance as InnerException
                            raise = new InvalidOperationException(message, raise);
                        }
                    }
                    throw raise;
                }
            }
        }

        //update report
        public void PUT(int id, patient_report report)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var report1 = entities.patient_report.Find(id);
                report1.FT4 = report.FT4;
                report1.TSH = report.TSH;
                report1.timestamp = report.timestamp;

                entities.Entry(report1).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete report by report_id
        public string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                patient_report reportid = entities.patient_report.Find(id);
                entities.patient_report.Remove(reportid);
                entities.SaveChanges();
                return "Report Deleted Successfully";
            }
        }

        //delete reports by patient id
        public string DeleteByPatient(int patientid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                var infoids = entities.patient_report.Where(w => w.patient_id == patientid);

                foreach (patient_report infoid in infoids)
                {
                    entities.patient_report.Remove(infoid);
                }
                entities.SaveChanges();
                return "Reports deleted";
            }
        }

    }
}
