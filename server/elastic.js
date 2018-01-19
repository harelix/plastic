
const elasticProvider = require('./elastic.provider');
const Errors = require('./errors').default;


exports.checkElasticStatus = (req, res, next) => {
    let client = elasticProvider.provider();
    client.checkStatus((err, reponse) => {
        if(err){
            next({ error : Errors.ELASTIC.es_not_available});
        }else{
            next();
        }
    });
}

exports.connectToElastic = (req, res) => {
    /*
    given elastic url
    get username and password for elastic instance
    remove hard coded local elastic
    */
};

exports.getAllIndices = (req, res, next) => {
    let client = elasticProvider.provider();
    client.getAllIndices((err, response) => {
        if(err){
            next({err : err});
        }else{
            req.elasticResponse = response;
            next();
        }
    });
};

exports.getAllTypes =  (req, res) => {
    let client = elasticProvider.provider();
    client.getAllTypes('es_elastic_monument', (err, response) => {
        if(err){
            res.setHeader('Content-Type', 'application/json');
            res.send(err);    
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(response);        
        }
    });
};

exports.getMappingForType =  (req, res, next) => {

    let client = elasticProvider.provider();
    
    client.getAllIndices((err, response) => {
        if(err){
            next({err : err});
        }else{
            req.elasticResponse = response;
            next();
        }
    });
};


exports.getDocumentsFromType =  (req, res, next) => {

    let client = elasticProvider.provider();
    let { index , type }  = req.requestParams;

    client.getAllDocumentsForType(index, type , ((err, response) => {
        if(err){
            next({err : err});
        }else{
            req.elasticResponse = response.hits;
            next();
        }
    }));
};

exports.searchDocuments =  (req, res, next) => {
    let client = elasticProvider.provider();
    let { index , type, field, term  }  = req.requestParams;

    client.searchDocuments(index, type , field, term , ((err, response) => {
        if(err){
            next({err : err});
        }else{
            req.elasticResponse = response;
            next();
        }
    }));
};

exports.getAllDocumentsForType = (req, res, next) => {
    let client = elasticProvider.provider();
    let { index , type }  = req.requestParams;

    client.getAllDocumentsForType(index, type , ((err, response) => {
        if(err){
            next({err : err});
        }else{
            try{
                req.elasticResponse = response.hits.hits;
            }
            catch(e){
                next({err : e.message});
                return;
            }
            next();
        }
    }));
};

exports.getDocumentByID =  (req, res, next) => {
    
    let client = elasticProvider.provider();
    let { index , type, uuid  }  = req.requestParams;
    if(!uuid){
        next();
        return;
    }

    client.getDocumentByID(index, type , '_id' /*take from configuration*/, uuid , ((err, response) => {
        if(err){
            next({err : err});
        }else{
            req.elasticResponse = response;
            next();
        }
    }));
};


exports.saveOrUpdateADocument = (req, res, next) => {

    let client = elasticProvider.provider();
    let { index, type, formData } = req.document;

    client.createOrUpdateADocument( index, type, formData , (err, reponse) => {
        if(err){
            next({ err : err.message});
        }else{
            next();
        }
    });
};
