oniApp.factory('eventService', function($http) {
  var eventService = {
    get: function() {
      var promise = $http.get('./data/lda-edges.json').then(function (response) {
          return response.data;
      });
      return promise;
    }
  };
  return eventService;
})
.factory('hostService', function($http) {
  var hostService = {
    get: function() {
      var promise = $http.get('./data/lda-nodes.json').then(function (response) {
          var output = [];
          var counter =[];
          response.data.forEach(function(item) {
                if (counter.indexOf(item.Id) == -1) {
                    counter.push(item.Id)
                    output.push(item);
                }
            });
          return output;
      });
      return promise;
    }
  };
  return hostService;
})