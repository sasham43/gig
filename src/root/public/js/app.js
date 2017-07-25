angular.module('GigApp', [])
  .factory('LoginService', function($http, $q){
    return {
      login: function(user){
        var d = $q.defer();

        $http.get('/login').then(function(resp){
          console.log('resp:', resp);
          d.resolve(resp);
        }).catch(function(err){
          console.log('err:', err);
          d.reject(err);
        });

        return d.promise;
      }
    }
  })
  .controller('LoginController', function($scope, LoginService){
    console.log('loaded');

    $scope.login = function(){
      LoginService.login({}).then(function(resp){
        console.log("did it");
      }).catch(function(err){
        console.log("error");
      });
    };
  })
