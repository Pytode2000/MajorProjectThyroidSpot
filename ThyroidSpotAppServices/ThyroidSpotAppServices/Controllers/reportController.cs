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

        //add new patient report
        public void POST(patient_report report)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.patient_report.Add(report);
                entities.SaveChanges();
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
                report1.drug_dose = report.drug_dose;
                report1.drug_name = report.drug_name;
                report1.timestamp = report.timestamp;

                entities.Entry(report1).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete report
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



    }
}
