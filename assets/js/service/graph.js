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
                        if (d[self._attr.nodeFill]==1) {
                            return "#0071C5";
                        } else if(d[self._attr.nodeFill]==0) {
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
                   .on("contextmenu", self.contextMenu(
                        [
                            {
                                title: 'isolate focus',
                                action:function (elm, d, i) {
                                    self.data.graph.set_display(d)
                                    $rootScope.df = self.data;
                                    $rootScope.$broadcast("event:d3-force-isolateNode", d);
                                }
                            },
                            {
                                title: 'add to ticket',
                                action:function (elm, d, i) {
                                    self.data.ticket.add_data(d)
                                    $rootScope.df = self.data;
                                    $rootScope.$broadcast("event:d3-force-addToTicket", d);
                                }
                            }
                        ]));
                }
            }
        };
        this.contextMenu = function (menu, openCallback) {
            // create the div element that will hold the context menu
            d3.selectAll('.d3-context-menu').data([1])
                .enter()
                .append('div')
                .attr('class', 'd3-context-menu');
            // close menu
            d3.select('body').on('click.d3-context-menu', function() {
                d3.select('.d3-context-menu').style('display', 'none');
            });
            // this gets executed when a contextmenu event occurs
            return function(data, index) {	
                var elm = this;
                d3.selectAll('.d3-context-menu').html('');
                var list = d3.selectAll('.d3-context-menu').append('ul');
                list.selectAll('li').data(menu).enter()
                    .append('li')
                    .html(function(d) {
                        return d.title;
                    })
                    .on('click', function(d, i) {
                        d.action(elm, data, index);
                        d3.select('.d3-context-menu').style('display', 'none');
                    });
                // the openCallback allows an action to fire before the menu is displayed
                // an example usage would be closing a tooltip
                if (openCallback) openCallback(data, index);
                // display context menu
                d3.select('.d3-context-menu')
                    .style('left', (d3.event.pageX - 2) + 'px')
                    .style('top', (d3.event.pageY - 2) + 'px')
                    .style('display', 'block');
		        d3.event.preventDefault();
	       };
       };
        this.init = function(){};
        return this.init();
    }
    return graphService;
}]);