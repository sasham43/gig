angular.module('GigApp', [])
  .factory('LoginService', function($http, $q){
    return {
      login: function(user){
        var d = $q.defer();

        $http.post('/auth/login', user).then(function(resp){
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
  .controller('LoginController', function(LoginService){
    console.log('loaded');
  })
