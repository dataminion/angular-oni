oniApp.directive('navBar', function() {
  return {
    templateUrl: './assets/template/directives/nav.html'
  }
}).directive('suspiciousConnectsPanel', function() {
  return {
    templateUrl: './assets/template/directives/sconnects.html'
  }
}).directive('playbookPanel', function() {
  return {
    templateUrl: './assets/template/directives/playbook.html'
  }
});