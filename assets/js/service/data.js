oniApp.service('dataService', function($http, $q) {
    var dataService = function(){
        var self = this
        this._events= [];
        this._display_events= [];
        this._counter_events= [];  
        this._hosts= [];
        this.host = null;
        this._host_list = [];
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
            filters : function () {
                var deferred = $q.defer();
                delete self['_host_list'];
                self['_host_list'] = [];
                try{
                    self._host_list.push(self.host.index);
                    delete self['_filtered_events'];
                    self['_filtered_events'] = clone(self._mapped_events);
                    self._filtered_events = self._filtered_events.map(function (n, i) {
                        n.values.visible = false;
                        if (self.host.index == n.source) {
                            n.values.visible = true;
                            if (self._host_list.indexOf(n.target) == -1) {
                                self._host_list.push(n.target);
                            }
                        }
                        if (self.host.index == n.target) {
                            n.values.visible = true;
                            if (self._host_list.indexOf(n.source) == -1) {
                                self._host_list.push(n.source);
                            }
                        }
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
            filters : function () {
                var deferred = $q.defer();
                try{
                    delete self['_filtered_hosts'];
                    self['_filtered_hosts'] = clone(self._mapped_hosts);
                    self._filtered_hosts = self._filtered_hosts.map(function (n, i) {
                        n.visible = false;
                        if(self._host_list.indexOf(i) >=0) {
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
                      self._mapped_events =  clone(self._events);
                      self._mapped_hosts  =  clone(self._hosts);
                        self._mapped_events = self._mapped_events.map(function (d) {                  
                        var s = -1, 
                            t = -1;
                        self._mapped_hosts = self._mapped_hosts.map(function (n, i) {
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
                    if(!nodeFilter){
                        self.host = null;
                        delete self['_display_hosts'];
                        delete self['_display_events'];
                        self['_display_hosts'] = clone(self._mapped_hosts);
                        self['_display_events'] = clone(self._mapped_events);
                        deferred.resolve(self);
                    } else {
                        self.host = nodeFilter; 
                        self.events.filters()
                        .then(function(a){return a.hosts.filters()})
                        .then(function(b){
                            delete self['_display_hosts'];
                            delete self['_display_events'];
                            self['_display_events'] = clone(b._filtered_events);
                            self['_display_hosts'] = clone(b._filtered_hosts);
                            }).finally(function(b){return b})
                        
                        deferred.resolve(self)
                    }
                
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