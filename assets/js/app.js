oniApp.run(function($rootScope, dataService, pageService) {
    $rootScope.df = new dataService();
    $rootScope.ps = new pageService();
    $rootScope.forceFire = false;
    // Set copyright year for footer
    $rootScope.copyrightYear = new Date().getFullYear()
}).controller('appCtrl', function ($rootScope, $scope, $log) {
    $scope.$on('event:d3-force-isolateNode', function(event, value) {
                $scope.forceFire = $rootScope.df.graph.set_display(value)
                .then(function (df) {return $rootScope.df = df})
                .finally(function (df) {
                    return true});
                
            });
    $scope.$on('event:window-resize', function(event, value) {
                $scope.forceFire = true;
                $scope.$digest();
            });
    $scope.delete = function (){
                $scope.forceFire = $rootScope.df.graph.set_display(null)
                .then(function (df) {return $rootScope.df = df})
                .finally(function (df) {
                     return true
                });
    }
    $scope.init = function(){
          $rootScope.df.events.set()
          .then(function (df) {return df.hosts.set()})
          .then(function (df) {return df.graph.set()})
          .then(function (df) {return df.graph.set_display(null)})
          .then(function (df) {$rootScope.df = df})
          .finally(function () {$scope.forceFire = true});
                 
    }
    
    return $scope.init();
})


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
}