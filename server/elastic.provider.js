
const composer = require('./elastic.query.composer');
const INDEX = 'es_index';

let elasticsearch = require('elasticsearch');
    let client = new elasticsearch.Client({
        host: 'localhost:9200'
        //log: 'trace'
});

const guid = function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

exports.provider =  () => {
   return {
        checkStatus(callback){
            client.ping({
                // ping usually has a 3000ms timeout
                requestTimeout: 1000
              }, function (error) {
                if (error) {
                    callback(null,{message : 'elastic server not available.'})
                } else {
                    callback({message : ''},null)
                }
              });
        },
        query(query, callback){
           client.search(query).then(callback);
        },
        searchDocuments(index, type, field, term, callback){
            let query = {
                index: index,
                type: type, 
                
                body: {
                    size : 50, 
                    from : 0,
                    query : { 
                        fuzzy : {
                            [field] : { 
                                value : term,
                                fuzziness :     2,
                                prefix_length : 2
                            }
                        }
                    }
                }
             };
            client.search(query, callback);
        }, 
        getAllDocumentsForType(index, type, callback){
            let query = {
                index: index,
                from: 0,
                size: 50,
                type: type
             };
            client.search({"from" : 0, "size" : 50, query : query}, callback);
        },
        createOrUpdateADocument(index, type, document, callback){
            let _id = (document._id || guid());
            delete document._id;

            client.index({
                index: index,
                type: type,
                id: _id,
                body: document
              }, callback);
        },
        getAllDocumentsForType(index, type, callback){ //should implement (from and size paging)
            client.search({ index , type, from : 0, size : 50}, callback);
        },
        getDocumentByID(index, type, field, uuid, callback){ //should implement (from and size paging)
            let query = {
                index: index,
                type: type, 
                body: {
                    query: {
                        terms : {[field] : [uuid]}
                    }
                }
             };
            client.search(query, callback);
        },
        getAllIndices(callback) {
            client.indices.get({ index : '_all'}, (err, response) => {
                callback(err, response);
            });
        },
        getMappingForType(index, type = '_all', callback){
            client.indices.getMapping({ index : index , type : '_all'}).then(callback);
        }
    };
};

