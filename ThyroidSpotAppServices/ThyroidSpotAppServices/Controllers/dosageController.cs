﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class dosageController : ApiController
    {

        //get all dosage info
        public IEnumerable<drug_dosage> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.drug_dosage.ToList();
            }
        }

        //get one dosage info via report_id (for debug)
        public drug_dosage Get(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.drug_dosage.FirstOrDefault(e => e.report_id == id);
            }
        }

        //add dosage
        public void POST(List<drug_dosage> drugdoses)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                foreach (drug_dosage drugdose in drugdoses)
                {
                    entities.drug_dosage.Add(drugdose);
               
                }
                entities.SaveChanges();
            }
        }


        //update dosage after report
        public void PUT(int id, drug_dosage drug)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var dosage = entities.drug_dosage.Find(id);
                dosage.drug_name = drug.drug_name;
                dosage.drug_dose = drug.drug_dose;

                entities.Entry(dosage).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete dosage
        public string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                drug_dosage drugdose = entities.drug_dosage.Find(id);
                entities.drug_dosage.Remove(drugdose);
                entities.SaveChanges();
                return "Deleted Successfully";
            }
        }

    }
}
