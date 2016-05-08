oniApp.service('pageService', function($rootScope, $window, $q) {
    
    var pageService = function(){
        var self = this
        this.document = document.querySelector('#chartbody');
        this.width = self.document.offsetWidth;
        this.height = self.document.offsetHeight;
        
        this.forceConfSet = function(update){    
            return {
            update : update,
            charge : -Math.round(self.height * 0.4),
            linkDistance : Math.round(self.height * 0.15),
            gravity : .1,
            size : [self.width, self.height],
            displayDiv : "#chart1",
            svgWidth : self.width - 30,
            svgHeight : self.height - 70,
            svgRatio :  Math.round(self.height * 0.015),
            radius: Math.round(self.width * 0.005),
            nominal_stroke : 1.5,
            nominal_base_node_size : 8,
            nominal_text_size : 10,
            max_text_size : 24,
            nominal_stroke : 1.5,
            max_stroke : 4.5,
            max_base_node_size : 36,
            nodeIdentifier : "Id",
            nodeFill : "ipInternal",
            nodeTextIdentifier : "Title",
        }};
        this.forceConf = self.forceConfSet(false);
        this.resize = function () {
            self.width = self.document.offsetWidth;
            self.height = self.document.offsetHeight;
            self.forceConf = self.forceConfSet(true);
            $rootScope.$broadcast("event:window-resize");
        }
        
        
        angular.element($window).bind('resize', self.resize);
        
        
        this.init = function(){};    
        return this.init();
    }
    
    
    
    return pageService;
});
        
        