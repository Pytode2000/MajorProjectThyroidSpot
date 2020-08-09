using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class userController : ApiController
    {
        //get all users (can be used for admin accs)
        public IEnumerable<user> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.user.ToList();
            }
        }

        //get one user info from firebase unique ID (to be done on javascript)
        public user Get(string uniqueid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.user.FirstOrDefault(e => e.user_id == uniqueid);
            }
        }

        //add new user
        public void POST(user info)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                entities.user.Add(info);
                entities.SaveChanges();
            }
        }

        //update user (via the dummy id, can be done in the UI)
        public void PUT(int id, user uinfo)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var patientinfo = entities.user.Find(id);
                patientinfo.full_name = uinfo.full_name;
                patientinfo.account_type = uinfo.account_type;

                entities.Entry(patientinfo).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete user (based on firebase unique id)
        public string Delete(string uniqueid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                //user userid = entities.user.Find(id);
                user userid = (user)entities.user.Where(m => m.user_id.Equals(uniqueid));
                entities.user.Remove(userid);
                entities.SaveChanges();
                return "user deleted";
            }
        }
    }
}
