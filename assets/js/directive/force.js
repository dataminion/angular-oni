oniApp
.directive('forceMap', function () {
    return {
        restrict: 'E',
        scope:{forceMapGraph: '='},
        link: function(scope) {
            scope.instance = []
            scope.conf = false;
            scope.graph = {
                color : d3.scale.category10(),
                svg : null,
                force : d3.layout.force(),
                link : null,
                node : null
            }
            //$watchers are looking for changes to the datamodel
            scope.$watch('forceMapGraph', function(d) {scope.instance = d;});
            scope.$watch('instance.attr', function(d) {if(d!=null){return scope.confGraph(d);}});
            scope.$watch('instance.data', function(d) {if(d!=null){if(scope.conf == true){scope.setupGraph(d);}}});

            scope.confGraph = function(attr) {
                scope.graph.force.charge(attr.charge)
                    .linkDistance(attr.linkDistance)
                    .gravity(attr.gravity)
                    .size(attr.size);
                scope.graph.svg = d3.select(attr.displayDiv)
                    .append("svg")
                    .attr("width", attr.svgWidth)
                    .attr("height", attr.svgHeight);
                scope.conf = true;
            }
            
            scope.setupGraph = function(data) {    
                scope.graph.force.nodes(data.nodes)
                      .links(data.links)
                      .on("tick", tick)
                      .start();
                
                scope.graph.tooltip = d3.select("body")
                            .append("div")
                            .classed('node-label', true);
                
                scope.graph.node = scope.graph.svg
                    .selectAll(".node")
                    .data(data.nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 10)
                    .attr("id", function (d) { return d.Id; })
                    .style("fill", function (d) {
                        if (d[scope.instance.attr.nodeFill]) {
                            return "#0071C5";
                        } else {
                            return "#fdb813";
                        }
                    })
                    .call(scope.graph.force.drag)
                    .on('mouseover', function (d) {
                       scope.graph.tooltip.html(d.ip + '<br/> <span class="x-small text-muted">Right click to apply IP filter</span>')
                              .style('visibility', 'visible');
                    })
//                   .on('mousemove', function () {
//                       if (($('body').width() - d3.event.pageX) < 130) {
//                           tooltip.style('top', (d3.event.pageY - 10) + 'px')
//                                  .style('left', (d3.event.pageX - 140) + 'px');
//                       }
//                       else {
//                           tooltip.style('top', (d3.event.pageY - 10) + 'px')
//                                  .style('left', (d3.event.pageX + 10) + 'px');
//                       }
//                   })
//                   .on("click", nodeclick)
//                   .on("contextmenu", function (d, i) {
//                       d3.event.preventDefault();                               
//                       var ipFilter = window.parent.document.getElementById('ip_filter');
//                       var btnApplyFilter = window.parent.document.getElementById('btn_searchIp');
//                       ipFilter.value = d.ip;
//                       btnApplyFilter.click();         
//                   })
//                   .on('mouseout', function () { tooltip.style('visibility', 'hidden'); });;     
                
                scope.graph.link = scope.graph.svg
                    .selectAll(".link")
                    .data(data.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function (d) {
                        return scope.instance.attr.edgeStroke ;
                    });

                  function tick() {
                    scope.graph.link
                        .attr("x1", function(d) { return d.source.x; })
                        .attr("y1", function(d) { return d.source.y; })
                        .attr("x2", function(d) { return d.target.x; })
                        .attr("y2", function(d) { return d.target.y; });

                    scope.graph.node
                        .attr("cx", function(d) { return d.x; })
                        .attr("cy", function(d) { return d.y; });
                      };
            }

        }
    }
}).factory('forceGraph', function(){
    var scope;
    var forceGraph = {
        init: function(dirScope){
            scope = dirScope;
        },
        confGraph : function(attr) {
                scope.graph.force.charge(attr.charge)
                    .linkDistance(attr.linkDistance)
                    .gravity(attr.gravity)
                    .size(attr.size);
                scope.graph.svg = d3.select(attr.displayDiv)
                    .append("svg")
                    .attr("width", attr.svgWidth)
                    .attr("height", attr.svgHeight);
                scope.conf = true;
            }
    }; 
    return forceGraph;              
});