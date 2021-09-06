using System;
using System.Collections.Generic;
using System.Text.Json;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Driver;

namespace ShoesMakerWeb.Controllers
{
    public class Shoes
    {
        public string Id;
        public string name;
        public string type;
        public byte[] picture;
        public Double price;
    }

    public class ShoesDetaiils
    {
        public string Id { get; set; }
        public byte[] image { get; set; }
        public Double price { get; set; }

    }

    [Route("api/[controller]")]
    [ApiController]
    public class shoesController : ControllerBase
    {
        // GET: api/shoes?type="sandal"&index=0
        [HttpGet]
        public string GetAllShoes(string type, int pageNum)
        {
            var index = pageNum - 1;
            // Connect to mongoDB
            MongoClient dbClient = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lyuqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
            var database = dbClient.GetDatabase("shoes_db");
            // Get collection
            var collection = database.GetCollection<Shoes>("shoes");

            List<ShoesDetaiils> ShoesList = new List<ShoesDetaiils>();
            for (int i = index * 50; i < index * 50 + 50; i++)
            {
                var IdFilter = Builders<Shoes>.Filter.Eq("Id", type + i);
                var indexDoc = collection.Find(IdFilter);

                foreach (Shoes d in indexDoc.ToEnumerable())
                {
                    ShoesDetaiils shoe = new ShoesDetaiils { Id = d.Id, image = d.picture, price = d.price };
                    ShoesList.Add(shoe);
                }
            }

            var options = new JsonSerializerOptions { WriteIndented = true };
            string jsonString = JsonSerializer.Serialize(ShoesList, options);

            return jsonString;
        }
    }
}