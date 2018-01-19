const errors = require('./errors');

exports.extractDocumentData = (filter, contentAwareWidgets) => {
    return (req, res, next) => {
        let { elasticResponse , uiSchema, schema } = req;
        try{
            let response = formatFormDataContents(filter(elasticResponse), 
                                    new contentAwareProcessorFunc(contentAwareWidgets, uiSchema, schema));
            req.formData = response;
            next();
        }
        catch(exception){
            next(errors.FORMATTING);
        }
    };
};

var contentAwareProcessorFunc = function contentAwareProcessorFunc(contentAware, schema, uiSchema){
    if(contentAware){
        return (element) => {
            return element;
        };
    }
    else{
        return (element) => {
            return element;
        }
    }
};

var formatFormDataContents = function formatFormDataContents(rootElement, contentAwareProcessor){
    
    //todo: implement contentAwareProcessor (for instance: if text is long set uiSchema element to textarea)
    Object.keys(rootElement).map( key => {
        let element = rootElement[key];
        if(element==null){
            delete rootElement[key];
        };

        if(element!=null && typeof element=='object'){
            var elementKeys = Object.keys(element);
            if(elementKeys.length > 0){
                rootElement[key] = formatFormDataContents(element);
            };
        }
    });
    return rootElement;
}


exports.elasticFilters = {
    Default : (data) => {
        if(data.hits && data.hits.hits){
            try{
                let _id = data.hits.hits[0]._id;
                data = data.hits.hits[0]._source;
                data._id = _id;
                data.uuid = _id;
                return data;
            }catch(e){
                return {};
            }
        }
        else{
            return {};
        }
    }
};