oniApp.service('pageService', function($q) {
    var pageService = function(){
        var self = this
        this.document = document.querySelector('#chartbody');
        this.width = self.document.offsetWidth;
        this.height = self.document.offsetHeight;
        this.forceConf = {
        charge : -Math.round(self.height * 0.4),
        linkDistance : Math.round(self.height * 0.08),
        gravity : .1,
        size : [self.width, self.height],
        displayDiv : "#chart1",
        svgWidth : self.width - 30,
        svgHeight : self.height - 70,
        svgRatio :  Math.round(self.height * 0.015),
        edgeStroke : 3,
        nodeIdentifier : "Id",
        nodeFill : "ipInternal",
        nodeTextIdentifier : "Title",
        };
        this.init = function(){};

        return this.init();
    }
    return pageService;
});