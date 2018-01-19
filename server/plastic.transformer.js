
 


exports.default = {
    extractMapping : () => {
        return (req, res, next) => {
            let inidices = [];
            let { index } = req.requestParams;
            let selectedIndex = req.elasticResponse[index] || {};
            if(!selectedIndex.mappings){
                next('error: index does not exists.');
                return;
            }
            req.elasticData = selectedIndex.mappings;
            next();
        };
    },
    extractIndices : (instructions) => {
        return (req, res, next) => {
            let inidices = [];
            Object.keys(req.elasticResponse).map((indexName) => {
                inidices.push(indexName);
            }); 
            req.elasticData = req.elasticResponse;
            next();
        };
    }
};