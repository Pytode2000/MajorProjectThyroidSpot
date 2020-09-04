using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ThyroidDataAccess;

namespace ThyroidSpotAppServices.Controllers
{
    public class forumcommentsController : ApiController
    {
        //get all comments (for postman testing)
        public IEnumerable<forum_comment> Get()
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.forum_comment.ToList();
            }
        }

        //get comments via comment forumid
        public IEnumerable<forum_comment> Get(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                return entities.forum_comment.Where(s => s.forum_id == id).ToList();
            }
        }

        //add comment
        public void POST(forum_comment foracomment)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                entities.forum_comment.Add(foracomment);

                entities.SaveChanges();
            }
        }

        //update comment via comment id
        public void PUT(int id, forum_comment forumcomment)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                var fcomment = entities.forum_comment.Find(id);
                fcomment.comment = forumcomment.comment;
                fcomment.timestamp = forumcomment.timestamp;
                fcomment.username = forumcomment.username;

                entities.Entry(fcomment).State = System.Data.Entity.EntityState.Modified;
                entities.SaveChanges();
            }
        }

        //delete comment by comment id
        public string Delete(int id)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {
                forum_comment commentid = entities.forum_comment.Find(id);
                entities.forum_comment.Remove(commentid);
                entities.SaveChanges();
                return "Comment Deleted Successfully";
            }
        }


        //delete comments by forum id
        public string DeleteByForumID(int forumid)
        {
            using (ThyroidDataEntities entities = new ThyroidDataEntities())
            {

                var forumidss = entities.forum_comment.Where(w => w.forum_id == forumid);

                foreach (forum_comment forumids in forumidss)
                {
                    entities.forum_comment.Remove(forumids);
                }
                entities.SaveChanges();
                return "Forum comments deleted";
            }
        }
    }
}
