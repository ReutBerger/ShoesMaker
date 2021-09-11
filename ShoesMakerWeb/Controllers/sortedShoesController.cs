using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

using Microsoft.AspNetCore.Mvc;

using MongoDB.Driver;

namespace ShoesMakerWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SortedShoesController : ControllerBase
    {
        // GET: api/sortedShoes?type="sandal"&order="ascending"&index=0
        [HttpGet]
        public string GetSortedShoes(string type, string order, int pageNum)
        {
            try
            {
                var index = pageNum - 1;
                // Connect to mongoDB
                MongoClient dbClient = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@sandbox.lyuqr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
                var database = dbClient.GetDatabase("shoes_db");
                // Get collection
                var collection = database.GetCollection<Shoes>("shoes");

                var filter = Builders<Shoes>.Filter.Eq("type", type);
                // Sort Shoes by price
                var sortDefinition = Builders<Shoes>.Sort.Descending(a => a.price);
                if (order == "ascending")
                {
                    sortDefinition = Builders<Shoes>.Sort.Ascending(a => a.price);
                }
                var listofShoes = collection.Find(filter).Sort(sortDefinition).ToList();

                List<ShoesDetaiils> ShoesList = new List<ShoesDetaiils>();
                for (int i = index * 50; i < index * 50 + 50; i++)
                {
                    ShoesDetaiils shoe = new ShoesDetaiils { Id = listofShoes[i].Id, Image = listofShoes[i].picture, Price = listofShoes[i].price };
                    ShoesList.Add(shoe);
                }

                var options = new JsonSerializerOptions { WriteIndented = true };
                string jsonString = JsonSerializer.Serialize(ShoesList, options);

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