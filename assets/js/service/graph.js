oniApp.service('graphService', ['$rootScope', function($rootScope) {
    var graphService = function(){
        var self = this;
        this.data = {};
        this._color = d3.scale.category10();
        this._svg = null;
        this._force = d3.layout.force();
        this._tooltip = null;
        this._link = null;
        this._node = null;
        this.conf = false;
        this._setup = false;
        this._attr = [];
        this.graph = {
            conf : function (attr) {
                self._attr = attr;
                self._force.charge(self._attr.charge)
                    .linkDistance(self._attr.linkDistance)
                    .gravity(self._attr.gravity)
                    .size(self._attr.size);
                 self._svg = d3.select(self._attr.displayDiv)
                    .append("svg")
                    .attr("width", self._attr.svgWidth)
                    .attr("height", self._attr.svgHeight);   
                self._tooltip = d3.select(self._attr.displayDiv)
                    .append("div")
                    .classed('node-label', true);
                self.conf = true;
            },
            setup : function (data) {
                self.data = data;
                self._force.nodes(self.data.hosts.get())
                      .links(self.data.events.get())
                    .on("tick", function (){
                        self._link
                            .attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });
                        self._node
                            .attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return d.y; });
                        })
                      .start();
                
                self._link = self._svg.append("g").attr("class", "link").selectAll(".link")
                    .data(data.events.get())
                    .enter().append("line")
                    .attr("id", function (d) { return [d.source.Id, d.target.Id]; })
                    .style("stroke-width", function (d) {
                        return self._attr.edgeStroke ;
                    });
                self._node = self._svg.append("g").attr("class", "node").selectAll(".node")
                    .data(self.data.hosts.get())
                    .enter().append("circle")
                    .attr("r", 10)
                    .attr("id", function (d) { return d.Id; })
                    .style("fill", function (d) {
                        if (d[self._attr.nodeFill]) {
                            return "#0071C5";
                        } else {
                            return "#fdb813";
                        }
                    })
                    .call(self._force.drag)
                self.graph.node.actions();
            },
            filter : function (data) {
                self._svg.selectAll('svg > *').remove()
                self._link.selectAll(".link").remove()
                self._node.selectAll(".node").remove()
                self.graph.setup(data)
            },
            node : {
                actions : function(){
                    self._node.on('mouseover', function (d) {
                       self._tooltip.html(d.Title + '<br/> <span class="x-small text-muted">Right click to apply IP filter</span>')
                              .style("left", "30px")
                              .style("top", "60px")
                              .style('visibility', 'visible');
                    })
                    .on('mouseout', function () { self._tooltip.style('visibility', 'hidden'); })  
                    //.on("click", nodeclick)
                   .on("contextmenu", function (d, i) {
                        //var position = d3.mouse(this);
                        //d3.select('#my_custom_menu')
                          //.style('position', 'absolute')
                          //.style('left', position[0] + "px")
                          //.style('top', position[1] + "px")
                          //.style('display', 'block');
                       self.data.graph.set_display(d)
                       $rootScope.df = self.data;
                        $rootScope.$broadcast("event:d3-force-isolateNode", d);
                        self._tooltip.html('This Worked')
                              .style("left", (d.x+20)+"px")
                              .style("top", (d.y)+"px")
                              .style('visibility', 'visible'); 
                
                       d3.event.preventDefault();
                   });
                }
            }
        };
        this.init = function(){};
        return this.init();
    }
    return graphService;
}]);