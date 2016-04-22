oniApp
.directive('forceMap', function (forceGraph) {
    return {
        restrict: 'E',
        scope:{forceMapGraph: '='},
        link: function(scope) {
            scope.instance = [];
            scope.g = new forceGraph();
            //$watchers are looking for changes to the datamodel
            scope.$watch('forceMapGraph', function(d) {scope.instance = d;});
            scope.$watch('instance.attr', function(d) {if(d!=null){scope.g.confGraph(d);}});
            scope.$watch('instance.data', function(d) {if(d!=null){if(scope.g.conf == true){scope.g.setupGraph(d);}}});
            }
        }
    }
).factory('forceGraph', function(){
    var forceGraph = function(){this.initialize = {
        color : d3.scale.category10(),
        svg : null,
        force : d3.layout.force(),
        tooltip : null,
        link : null,
        node : null,
        conf : false,
        setup : false,
        attr : [],
        confGraph : function(attr) {
                this.attr = attr;
                this.force.charge(this.attr.charge)
                    .linkDistance(this.attr.linkDistance)
                    .gravity(this.attr.gravity)
                    .size(this.attr.size);
                this.svg = d3.select(this.attr.displayDiv)
                    .append("svg")
                    .attr("width", this.attr.svgWidth)
                    .attr("height", this.attr.svgHeight);
                this.tooltip = d3.select(this.attr.displayDiv)
                    .append("div")
                    .classed('node-label', true);
                this.conf = true;
            },
        setupGraph : function(data) {  
    
                var attr = this.attr;
                this.force.nodes(data.nodes)
                      .links(data.links)
                    .on("tick", function (){
                        link
                            .attr("x1", function(d) { return d.source.x; })
                            .attr("y1", function(d) { return d.source.y; })
                            .attr("x2", function(d) { return d.target.x; })
                            .attr("y2", function(d) { return d.target.y; });
                        node
                            .attr("cx", function(d) { return d.x; })
                            .attr("cy", function(d) { return d.y; });
                        })
                      .start();
                
                var link = this.svg.append("g").attr("class", "link").selectAll(".link")
                    .data(data.links)
                    .enter().append("line")
                    .style("stroke-width", function (d) {
                        return attr.edgeStroke ;
                    });
                var node = this.svg.append("g").attr("class", "node").selectAll(".node")
                    .data(data.nodes)
                    .enter().append("circle")
                    .attr("r", 10)
                    .attr("id", function (d) { return d.Id; })
                    .style("fill", function (d) {
                        if (d[attr.nodeFill]) {
                            return "#0071C5";
                        } else {
                            return "#fdb813";
                        }
                    })
                    .call(this.force.drag)
                
                    
                
                this.setupNodeActions(node);
            
                
                  
                
    },
        setupNodeActions : function(node) {
            var tooltip = this.tooltip;
            var attr = this.attr;   
            node
                    .on('mouseover', function (d) {
                console.log(d);
                       tooltip.html(d.Title + '<br/> <span class="x-small text-muted">Right click to apply IP filter</span>')
                              .style("left", "30px")
                              .style("top", "60px")
                              .style('visibility', 'visible');
                    })

//                   .on("click", nodeclick)
//                   .on("contextmenu", function (d, i) {
//                       d3.event.preventDefault();                               
//                       var ipFilter = window.parent.document.getElementById('ip_filter');
//                       var btnApplyFilter = window.parent.document.getElementById('btn_searchIp');
//                       ipFilter.value = d.ip;
//                       btnApplyFilter.click();         
//                   })
                   .on('mouseout', function () { tooltip.style('visibility', 'hidden'); });;     
            },
            setupEdgeActions : function() {
                this.edge   
            },
        actionGraph : Action,
    }

    // Call the initialize function for every new instance
    return this.initialize;
    };
    var Action  = {
        nodeClick: null,
        edgeClick: null,
        nodeHover: null,
        edgeHover: null,
        highlightEdge: null,
        mouseOut: null,
        showFullGraphWithSelectedEdge: null
    }
     
    return forceGraph;              
});