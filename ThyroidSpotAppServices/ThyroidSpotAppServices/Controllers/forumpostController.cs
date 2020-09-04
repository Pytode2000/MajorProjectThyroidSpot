using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class forumpostController : ApiController
    {

        //get all forum posts (for postman testing)
        public IEnumerable<disease_forum> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.disease_forum.ToList();
            }
        }


        //get all forum posts based on disease name
        public IEnumerable<disease_forum> Get(string disease)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.disease_forum.Where(s => s.disease_name == disease).ToList();
            }
        }

        //get one forum post
        public disease_forum Get(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.disease_forum.FirstOrDefault(e => e.idForum == id);
            }
        }

        //add forum post
        public void POST(disease_forum forumdetails)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                entities.disease_forum.Add(forumdetails);


                entities.SaveChanges();
            }
        }

        //update forum by forum id
        public void PUT(int id, disease_forum forum)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var fpost = entities.disease_forum.Find(id);
                fpost.post_title = forum.post_title;
                fpost.post_description = forum.post_description;
                fpost.timestamp = forum.timestamp;
                fpost.post_img = forum.post_img;
                fpost.disease_name = forum.disease_name;
                fpost.user_name = forum.user_name;

                entities.Entry(fpost).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete forum post via forum id
        //NOTE: if user did not delete forum before removing account, name displayed on post
        //will be [deleted], like reddit
        public string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                disease_forum postid = entities.disease_forum.Find(id);
                entities.disease_forum.Remove(postid);
                entities.SaveChanges();
                return "Forum Deleted Successfully";
            }
        }
    }
}
