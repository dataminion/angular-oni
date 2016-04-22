oniApp.factory('graphService', function($http, $q) {
     var __links= null;
     var __nodes= null;
    
    var Links = {
    get: function() {
        if(__links == null){
            var promise = $http.get('./data/lda-edges.json').then(function (response) {
                __links = response.data;  
                return response.data;
              });
            }
        else{ 
            var deferral = $q.defer()
            deferral.resolve( __links );
             promise = deferral.promise
            }
        return promise;
    }
  };
  var Nodes = {
    get: function() {
        if(__nodes == null){
            var promise = $http.get('./data/lda-nodes.json').then(function (response) {
                  var output = [];
                  var counter =[];
                  response.data.forEach(function(item) {
                        if (counter.indexOf(item.Id) == -1) {
                            counter.push(item.Id)
                            output.push(item);
                        }
                    });
                  __nodes = output;  
                  return output;
              });
            }
        else{ 
            var deferral = $q.defer()
            deferral.resolve( __nodes);
             promise = deferral.promise
            }
        return promise;
    }
  };
    var graphService = {
        links : Links,
        nodes : Nodes
    }
    
  
  return graphService;
})

    
//    graphService.links.get()
//    graphService.nodes.get().then(function (rnodes) {
//        graphService.links.get()
//        .then(function (d) {
//           var nextSet = d.map(function (d) {
//                var nodeSource = rnodes.map(function (n, i) { if (n.Id == d.source) return i }).filter(isFinite);
//                var nodeTarget = rnodes.map(function (n, i) { if (n.Id == d.target) return i }).filter(isFinite);
//                return {
//                    source: nodeSource.length > 0 ? nodeSource[0]: -1,
//                    target: nodeTarget.length > 0 ? nodeTarget[0]: -1,
//                    values: d  
//                       }
//            })
//        });
//        });