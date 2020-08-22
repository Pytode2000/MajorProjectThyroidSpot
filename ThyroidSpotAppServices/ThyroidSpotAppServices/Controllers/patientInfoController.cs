﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class patientInfoController : ApiController
    {
        //get all patient info (can be used for doctor-only accs)
        public IEnumerable<patient_information> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_information.ToList();
            }
        }

        //get one patient info via firebase UID (can be used for patient-only accs)
        public patient_information Get(string id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_information.FirstOrDefault(e => e.user_id == id);
            }
        }

        //get patient info via doctor id(can be used for doctor-only accs)
        public patient_information GetByDoctorID(string doctorid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.patient_information.FirstOrDefault(e => e.doctor_id == doctorid);
            }
        }

        //add new patient 
        public void POST(patient_information info)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.patient_information.Add(info);
                entities.SaveChanges();
            }
        }


        //update report
        public void PUT(string userid, patient_information pinfo)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var patientinfo = entities.patient_information.FirstOrDefault(e => e.user_id == userid);
                patientinfo.user_id = pinfo.user_id;
                patientinfo.diagnosis = pinfo.diagnosis;
                patientinfo.ic_number = pinfo.ic_number;
                patientinfo.date_of_birth = pinfo.date_of_birth;
                patientinfo.gender = pinfo.gender;
                patientinfo.blood_type = pinfo.blood_type;
                patientinfo.timestamp = pinfo.timestamp;
                patientinfo.doctor_id = pinfo.doctor_id;


                entities.Entry(patientinfo).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete patient info 
        public string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                patient_information infoid = entities.patient_information.Find(id);
                entities.patient_information.Remove(infoid);
                entities.SaveChanges();
                return "Patient info deleted";
            }
        }
    }
}
