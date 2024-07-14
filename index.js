const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const auth = "3cP4srG0qVlub2Pe"
const modelName = "Server"

mongoose.connect(process.env.SRV,{ useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Connected!"))
var db = mongoose.connection;

const app = express()
  app.all('/', (req, res) => {
  res.send('<h2>Server is ready!</h2>');
});

const listener = app.listen(3000, () => {
    console.log("APP | Application listening on port " + listener.address().port);
  });

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

const schema = new mongoose.Schema({
  data: JSON
});
const model = mongoose.model(modelName, schema)

app.get("/allData", async (request, response) => {
  if(request.headers.authorization === auth) {
    let data
    try {
      data = await mongoose.model(modelName).find({})
    }
    catch(err) {
      console.log("DATABASE | Error: " + err)
    }
    if(data) {
      response.status(200)
      response.json({
        status: "success",
        message: "200 | Servers found",
        data: data
      })
    }
    else {
      response.status(404)
      response.json({
        status: "error",
        message: "404 | Servers not found"
      })
    }
  }
})

  app.post("/addServer/", async (request, response) => {
    if(request.headers.authorization === auth) {
      const model = mongoose.model(modelName);
      const newModel = new model(request.body);
      newModel.save()
      response.status(201)
      response.json({
        status: "success",
        message: "201 | Created",
        data: newModel
      })
      console.log(`New ${modelName} added`);
    }
  })
app.delete("/removeServer/:id", async (request, response) => {
  // check for authorization
  if (request.headers.authorization === auth) {
    try {
      // delete the data
      const deletedModel = await mongoose.model(modelName).findByIdAndDelete(request.params.id);
      if (deletedModel) {
        // success
        response.status(200)
        response.json({
          status: "success",
          message: "200 | Removed",
          data: deletedModel
        });
        console.log(`${modelName} removed`);
      } else {
        // could not find data
        response.status(404)
        response.json({
          status: "error",
          message: "404 | Not found"
        });
      }
    } catch (err) {
      // server error
      console.log("DATABASE | Error: " + err);
      response.status(500)
      response.json({
        status: "error",
        message: "500 | Internal Server Error"
      });
    }
  }
});
// update data
app.put("/updateServer/:id", async (request, response) => {
  // check for authorization
  if (request.headers.authorization === auth) {
    try {
      const id = request.params.id;
      const { data } = request.body;
      // perform the update function
      const updatedModel = await mongoose.model(modelName).findByIdAndUpdate(
        id,
        { data },
        { new: true }
      );
      if (updatedModel) {
        // success
        response.status(200)
        response.json({
          status: "success",
          message: "200 | Updated",
          data: updatedModel
        });
        console.log(`${modelName} updated`);
      } else {
        // could not find model
        response.status(404)
        response.json({
          status: "error",
          message: "404 | Not found"
        });
      }
    } catch (err) {
      // server error
      console.log("DATABASE | Error: " + err);
      response.status(500)
      response.json({
        status: "error",
        message: "500 | Internal Server Error"
      });
    }
  }
});
