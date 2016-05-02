oniApp.run(function($rootScope, dataService, pageService) {
    $rootScope.df = new dataService();
    $rootScope.ps = new pageService();
    $rootScope.forceFire = false;
    // Set copyright year for footer
    $rootScope.copyrightYear = new Date().getFullYear()
}).controller('appCtrl', function ($rootScope, $scope, $log) {
    
    
    $scope.$on('event:d3-force-isolateNode', function(event, value) {
                $scope.forceFire = true;
                $scope.$digest();
            });
    $scope.delete = function (){
                $rootScope.df.graph.set_display();
                $scope.forceFire = true;
    }
    
    $rootScope.df.events.set().then(function () {
        $rootScope.df.hosts.set().then(function () {
            $rootScope.df.graph.set_display()
        }).then(function () {
            $scope.forceFire = true;
        })
    });
})