const path = require("path");
const express = require("express");
const webpack = require("webpack");

const server = process.env.RJSF_DEV_SERVER || "localhost:8080";
const splitServer = server.split(":");
const host = splitServer[0];
const port = splitServer[1];
const env = "dev";

const webpackConfig = require("./webpack.config." + env);
const compiler = webpack(webpackConfig);
const app = express();

const RequestProvider  = require('./server/middleware/Cerberus');
const plasticTransformer = require('./server/plastic.transformer').default;
const elastic = require("./server/elastic");
const plastic = require("./server/plastic");
const Cerberus = RequestProvider.Cerberus; 
const plasticSchemaAdapter = require('./server/plastic.schema.adapter').default;
const plasticFormDataAdapter = require('./server/plastic.form.data.adapter').default;
const plasticFormDataPopulator = require('./server/plastic.form.data.populator').default;
const bodyParser = require('body-parser')


app.disable('x-powered-by')
    .use( bodyParser.json())       // to support JSON-encoded bodies
    .use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }))
    .use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    })
    .use(require("webpack-dev-middleware")(compiler, {
      publicPath: webpackConfig.output.publicPath,
      noInfo: true
    }))
    .use(require("webpack-hot-middleware")(compiler));


//-----------------------------------------------------
// get all indices from elastic cluster or single server
//-----------------------------------------------------
app.get("/api/elastic/indices", 
  elastic.checkElasticStatus,
  elastic.getAllIndices, 
  plasticTransformer.extractIndices({ config : null}), 
    function(req, res){
      res.send(req.elasticData);
    });


//-----------------------------------------------------
// mapping for type
//-----------------------------------------------------
app.get("/api/elastic/mapping/:index/:type", 
Cerberus.middlewareBootstrap({
      index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
      type  : () => Cerberus.initValidator('throw this error message', false).isBlank()
    }),          
    elastic.checkElasticStatus,
    elastic.getMappingForType,
    plasticTransformer.extractMapping({ config : null}),
    plasticSchemaAdapter.mappingAdapter({ config : null }),
    (req, res) => {
      res.send({ 
        schema : req.schema,
        uiSchema: req.uiSchema,
        formData: {}
    });
  });


//---------------------------------------------------------------------
// create/update (given uuid attached to document) new elastic document 
//---------------------------------------------------------------------
app.post("/api/elastic/document/:index/:type",          
          Cerberus.middlewareBootstrap({
            index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
            type  : () => Cerberus.initValidator('throw this error message', false).isBlank(),
          }),
          elastic.checkElasticStatus,
          plasticFormDataAdapter.adapter(),
          elastic.saveOrUpdateADocument,
          (req, res) => {
              res.send({ response : 'created/updated.'});
          });

          
//-----------------------------------------------------
// search documents by term
//-----------------------------------------------------
app.get("/api/elastic/search/:index/:type/:field/:term", 
        Cerberus.middlewareBootstrap({
          index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
          type  : () => Cerberus.initValidator('throw this error message', false).isBlank(),
          field  : () => Cerberus.initValidator('throw this error message', false).isBlank(),
          term  : () => Cerberus.initValidator('throw this error message', false).isBlank()
        }),
        elastic.checkElasticStatus,
        elastic.searchDocuments,
        plastic.extractDocumentData(plastic.elasticFilters.Default),
        function(req, res) {
          res.send(req.elasticResponse);
        });


  //-----------------------------------------------------
  // get documents from elastic index or type
  //-----------------------------------------------------
  app.get("/api/elastic/documents/:index/:type", 
          Cerberus.middlewareBootstrap({
            index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
            type  : () => Cerberus.initValidator('throw this error message', false).isBlank()
          }),
          elastic.getDocumentsFromType,
          (req, res) => {
            res.send(req.elasticResponse);
          });
          

//-----------------------------------------------------
// get all docs for index & type
//-----------------------------------------------------
app.get("/api/elastic/document/all/:index/:type",          
          Cerberus.middlewareBootstrap({
            index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
            type  : () => Cerberus.initValidator('throw this error message', false).isBlank()
          }),          
          elastic.checkElasticStatus,
          elastic.getAllDocumentsForType,
          plastic.extractDocumentData(plastic.elasticFilters.Default, false),
          (req, res) => {
              res.send(req.elasticResponse);
          });
//---------------------------------------------------------------------
//get documnet by id/uuid
//---------------------------------------------------------------------
app.get("/api/elastic/document/:index/:type/:uuid?",          
          Cerberus.middlewareBootstrap({
            index : () => Cerberus.initValidator('throw this error message', false).isBlank(),
            type  : () => Cerberus.initValidator('throw this error message', false).isBlank(),
            uuid  : () => Cerberus.initValidator('throw this error message', false).isBlank()
          }),          
          elastic.checkElasticStatus,
          elastic.getMappingForType,
          plasticTransformer.extractMapping({ config : null}),
          plasticSchemaAdapter.mappingAdapter({ config : null }),
          elastic.getDocumentByID,
          plastic.extractDocumentData(plastic.elasticFilters.Default, true),
          (req, res) => {
            res.send({ 
              schema : req.schema,
              uiSchema: req.uiSchema,
              formData: req.formData
          });
        });
        
app.get("/favicon.ico", function(req, res) {
  res.status(204).end();
});

app.get("/*", function(req, res) {
  //res.sendFile(path.join(__dirname, "playground", "index.html"));
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.listen(port, host, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Listening at http://${server}`);
});



app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send({ error : err.error.client_message });
})