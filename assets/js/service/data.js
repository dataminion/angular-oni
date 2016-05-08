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
        this._mapped_events= [];
        this._mapped_hosts= [];
        this._filtered_events = [];
        this._filtered_hosts = [];
        this._ticket= [];
        this.ticket = {
            
        };
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
                  return self;
                })
                return promise;
            },
            filters : function (nodeFilter) {
                var deferred = $q.defer();
                var host_list = [];
                try{
                    host_list.push(nodeFilter.Id);
                    self._filtered_events = self._mapped_events.map(function (n, i) {
                        n.values.visible = false;
                        if(nodeFilter.Id == n.source.Id) {
                            n.values.visible = true;
                        if (host_list.indexOf(n.target.Id) == -1) {
                            host_list.push(n.target.Id);
                        }
                        }
                        if(nodeFilter.Id == n.target.Id) {
                            n.values.visible = true;
                        if (host_list.indexOf(n.source.Id) == -1) {
                            host_list.push(n.source.Id);
                        }
                        }
                        
                        
                        return n
                    });
                    deferred.resolve({self: self, hosts : host_list}); 
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
                            item['degree'] = 0;
                            self._hosts.push(item);
                        }
                    });
                    return self;
                });
                return promise;
            },
            filters : function (events) {
                var deferred = $q.defer();
                try{
                    self._filtered_hosts = self._display_hosts.map(function (n, i) {
                        n.visible = false;
                        if(events.indexOf(n.Id) >=0) {
                            
                            n.visible = true;}
                        return n
                    });
                    deferred.resolve(self);
                }
                catch(e){
                    deferred.reject(e);
                    }
                return deferred.promise;
            }
        };
        this.graph = {
            set : function () {
                var deferred = $q.defer();
                try{
                    self._mapped_events = self._events.map(function (d) {                  
                        var s = -1, 
                            t = -1;
                        self._mapped_hosts = self._hosts.map(function (n, i) {
                            if(parseInt(n.Id) == parseInt(d.source)) {n.degree ++; s = i;}
                            if(parseInt(n.Id) == parseInt(d.target)) {n.degree ++; t = i;}
                            n['visible'] = true;
                            return n
                        });
                        d['visible'] = true;
                        return {
                            source: s,
                            target: t,
                            values: d
                               }
                    }); 
                    deferred.resolve(self);
                    }
                catch(e){
                    deferred.reject(e);
                    }
                return deferred.promise;
            },
            
            set_display : function (nodeFilter = null) {
            var deferred = $q.defer();
                try{
                if(nodeFilter == null){
                    self.host = null;
                    self._display_hosts = self._mapped_hosts
                    self._display_events = self._mapped_events
                } else {
                    self.host = nodeFilter; 
                    self.events.filters(nodeFilter)
                    .then(function(a){return a.self.hosts.filters(a.hosts)})
                    .finally(function(b){
                            self._display_events = b._filtered_events;
                            self._display_hosts = b._filtered_hosts;
                        })
                }
                deferred.resolve(self);
                    }
                catch(e){
                    deferred.reject(e);
                    }
                return deferred.promise;
            }
        };
        this.init = function(){};

        return this.init();
    }
    return dataService;
});