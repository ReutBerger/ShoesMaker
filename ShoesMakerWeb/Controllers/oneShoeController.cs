using System;
using System.Linq;
using System.Text.Json;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Driver;

namespace ShoesMakerWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OneShoeController : ControllerBase
    {
        // GET: api/oneShoe?id="sandal0"
        [HttpGet]
        public string GetOneShoe(string id)
        {
            try
            {
                // Connect to mongoDB
                MongoClient dbClient = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lyuqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
                var database = dbClient.GetDatabase("shoes_db");
                // Get collection
                var collection = database.GetCollection<Shoes>("shoes");

                var IdFilter = Builders<Shoes>.Filter.Eq("Id", id);
                var ourShoe = collection.Find(IdFilter).FirstOrDefault();

                // Get specified shoe
                ShoesDetaiils shoe = new ShoesDetaiils { Id = id, Image = ourShoe.picture, Price = ourShoe.price };

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(shoe, options);

                return jsonString;
            }
            catch (Exception)
            {
                string error_ret = "error";
                return error_ret;
            }
            
        }
    }
}