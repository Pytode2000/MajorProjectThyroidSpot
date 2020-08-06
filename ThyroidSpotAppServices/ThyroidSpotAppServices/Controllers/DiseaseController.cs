using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class DiseaseController : ApiController
    {
        //get all disease infos
        public IEnumerable<disease_information> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.disease_information.ToList();
            }
        }

        //get one disease info
        public disease_information Get(string id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.disease_information.FirstOrDefault(e => e.disease == id);
            }
        }

        //add new disease info
        public void POST(disease_information disease)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.disease_information.Add(disease);
                entities.SaveChanges();
            }
        }


        //update disease info
        public void PUT(string id, disease_information diseaseinfo)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var diseasename = entities.disease_information.Find(id);
                diseasename.thumbnail = diseaseinfo.thumbnail;
                diseasename.description = diseaseinfo.description;
                diseasename.disease_content = diseaseinfo.disease_content;
                diseasename.symptom = diseaseinfo.symptom;
                diseasename.cause = diseaseinfo.cause;
                diseasename.treatment = diseaseinfo.treatment;
                diseasename.timestamp = diseaseinfo.timestamp;
                
                entities.Entry(diseasename).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete disease info
        public string Delete(string id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                disease_information disease = entities.disease_information.Find(id);
                entities.disease_information.Remove(disease);
                entities.SaveChanges();
                return "Deleted Successfully";
            }
        }

    }
}
