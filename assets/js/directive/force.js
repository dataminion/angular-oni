oniApp
.directive('forceMap', function (graphService) {
    return {
        restrict: 'E',
        scope:{forceMapConf: '=', forceMapData: '=', forceMapFire: '='},
        link: function(scope) {
            scope.g = new graphService();
            //$watchers are looking for changes to the datamodel
            scope.$watch('forceMapFire', function(d) {if(d!=false){
                if(scope.g.conf == true){
                    if(scope.forceMapConf.update == true){
                        scope.g.graph.updateConf(scope.forceMapConf);
                    }else{
                        scope.g.graph.filter(scope.forceMapData);
                    }
                }else{
                    scope.g.graph.conf(scope.forceMapConf);
                    scope.g.graph.setup(scope.forceMapData);
                }
                scope.forceMapConf.update = false;
                scope.forceMapFire = false;
            }});
        }
    }
});