oniApp.controller('appCtrl', function ($scope, eventService, hostService) {
    $scope.document = document.querySelector('#chartbody');
    $scope.width = $scope.document.offsetWidth;
    $scope.height = $scope.document.offsetHeight;
    $scope.forceGraph = {
                    data : null,
                    attr : null
                }
    $scope.forceGraphData = {
        links : null,
        nodes : null
    }
    $scope.forceGraphAttr = {
        charge : -Math.round($scope.height * 0.4),
        linkDistance : Math.round($scope.height * 0.08),
        gravity : .1,
        size : [$scope.width, $scope.height],
        displayDiv : "#chart1",
        svgWidth : $scope.width - 30,
        svgHeight : $scope.height - 70,
        svgRatio :  Math.round($scope.height * 0.015),
        edgeStroke : 3,
        nodeIdentifier : "Id",
        nodeFill : "ipInternal",
        nodeTextIdentifier : "Title",
    }

    eventService.get()
        .then(function (d) {
            $scope.forceGraphData.links = d;
        })
        .then(function () {
            hostService.get().then(function (d) {
                $scope.forceGraphData.nodes = d;
            }).then(function () { 
                
            $scope.forceGraphData.links = $scope.forceGraphData.links.map(function (d) {
                var nodeSource = $scope.forceGraphData.nodes.map(function (n, i) { if (n.Id == d.source) return i }).filter(isFinite);
                var nodeTarget = $scope.forceGraphData.nodes.map(function (n, i) { if (n.Id == d.target) return i }).filter(isFinite);
                return {
                    source: nodeSource.length > 0 ? nodeSource[0]: -1,
                    target: nodeTarget.length > 0 ? nodeTarget[0]: -1,
                    values: d  
                       }
            });
                $scope.forceGraph = {
                    data : $scope.forceGraphData,
                    attr : $scope.forceGraphAttr
                }
            });
        });
     
})
