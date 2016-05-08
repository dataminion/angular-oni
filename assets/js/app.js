oniApp.run(function($rootScope, dataService, pageService) {
    $rootScope.df = new dataService();
    $rootScope.ps = new pageService();
    $rootScope.forceFire = false;
    $rootScope.$on('update', $rootScope.$digest());
    // Set copyright year for footer
    $rootScope.copyrightYear = new Date().getFullYear()
}).controller('appCtrl', function ($rootScope, $scope, $log) { 
    $scope.$on('event:d3-force-isolateNode', function(event, value) {
                $rootScope.df.graph.set_display(value)
                .then(function (df) {$rootScope.df = df})
                .finally(function () {
                    $scope.forceFire = true
                    $scope.$digest();
                });
                
            });
    $scope.$on('event:window-resize', function(event, value) {
                $scope.forceFire = true;
                $scope.$digest();
            });
    $scope.delete = function (){
                $rootScope.df.graph.set_display(null)
                .then(function (df) {$rootScope.df = df})
                .finally(function () {
                    $scope.forceFire = true
                    $scope.$digest();
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