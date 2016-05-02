oniApp.service('dataService', function($http, $q) {
    var dataService = function(){
        var self = this
        this._events= [];
        this._display_events= [];
        this._counter_events= [];  
        this._hosts= [];
        this.host = null;
        this._display_hosts= [];
        this._counter_hosts= [];
        this.events = {
            get : function () {
                return self._display_events;
            },
            get_full : function () {
                return self._events;
            },
            set : function () {
                var promise = $http.get('./data/lda-edges.json').then(function (response) {
                  response.data.forEach(function(item) {
                    self._events.push(item);
                  })
                })
                return promise;
            },
            filters : function (nodeFilter) {
                var deferred = $q.defer();
                var conn = [];
                var value = [];
                try{
                    self._events.filter(function (a) { 
                           //create an array off all of the other nodes interacting with this one to pass up to the controller
                        var touple = [a.source, a.target];
                        var index = touple.indexOf(''+nodeFilter.Id+''); 
                        if ( index >= 0) {
                            touple = touple.reverse().splice(index, 1)[0];
                            if (conn.indexOf(touple) == -1){
                                conn.push(touple)
                                value.push(a)
                            } 
                        };
                    });
                    deferred.resolve({
                        conn : conn,
                        value : value
                    }); 
                }
                catch(e){
                    deferred.reject(e);
                    }
                return deferred.promise;
            }
        };
        this.hosts = {
            get : function () {
                return self._display_hosts;
            },
            get_full : function () {
                return self._hosts;
            },
            set : function () {
                var promise = $http.get('./data/lda-nodes.json').then(function (response) {
                    response.data.forEach(function(item) {
                        if (self._counter_hosts.indexOf(item.Id) == -1) {
                            self._counter_hosts.push(item.Id)
                            self._hosts.push(item);
                        }
                    });
                });
                return promise;
            },
            filters : function (conn) {
                var hostCounter = [];
                var deferred = $q.defer();
                try{
                    var hosts =  self._hosts.filter(function (a) { 
                        var index = conn.indexOf(''+a.Id+''); 
                        if ( index >= 0) {
                            if (hostCounter.indexOf(a.Id) == -1) {
                                hostCounter.push(a.Id)
                                return a;
                            } 
                        };
                    });
                    deferred.resolve(hosts);
                }
                catch(e){
                    deferred.reject(e);
                    }
                return deferred.promise;
            }
        };
        this.graph = {
            set : function () { 
                self._display_events = self._display_events.map(function (d) {                  
                    var nodeSource = self._display_hosts.map(function (n, i) { 
                        if (parseInt(n.Id) == parseInt(d.source)) return i 
                    }).filter(isFinite);
                    var nodeTarget = self._display_hosts.map(function (n, i) {
                        if (parseInt(n.Id) == parseInt(d.target)) return i 
                    }).filter(isFinite);
                    
                    return {
                        source: nodeSource.length > 0 ? nodeSource[0]: -1,
                        target: nodeTarget.length > 0 ? nodeTarget[0]: -1,
                        values: d  
                           }
                }); 
            },
            set_display : function (nodeFilter = null) {
                if(nodeFilter == null){
                    self.host = null;
                    self._display_hosts = self._hosts
                    self._display_events = self._events
                    self.graph.set();
                }else{
                    self.host = nodeFilter self.events.filters(nodeFilter).then(function(events){
                        self._display_events = events.value;
                        self.hosts.filters(events.conn).then(function(hosts){
                            self._display_hosts = hosts;
                            self._display_hosts.push(nodeFilter)
                        }).then(function(){
                            self.graph.set();
                        });
                    })
                }
            }
        };
        this.init = function(){};

        return this.init();
    }
    return dataService;
});