

describe('authController', function() {

    var $controller, $rootScope;

    beforeEach(function() {  
        module = angular.module("chirpApp",[]);
    });

    it("should be registered", function() {
        mod= angular.module("chirpApp",['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'angular-scroll-animate']);
        expect(module).toBeTruthy();
        expect(mod).not.toBeNull();
      });

      beforeEach(inject(function (_$controller_){
          $controller = _$controller_;
      }))
    // beforeEach(inject(function(_$controller_, _$rootScope_){
    //     // The injector unwraps the underscores (_) from around the parameter names when matching
    //     $controller = _$controller_;
    //     $rootScope = _$rootScope_;
    //   }));

    describe('$scope.progress', function() {
        it('AlertsController', function() {
          var $scope = {};
        //  var controller = $controller('AlertsController', { $scope: $scope });
          expect($scope.id).toEqual($scope.id);
       });
    describe('scope_id', function(){
        it('check scope id', function(){
            //  var scope=$rootscope.$new();
            //  var controller=$controller('authController', { $scope: scope });
            //  //$scope.id = 2;
            //  expect(scope.id).toBe(2);
         });
     });

     // describe('$scope.ID', function() {
    //     it('Check the scope object', function() {
    //         var $rootscope ;
    //         var controller = $controller('completeController', { $rootscope: $rootscope });
    //         expect($rootscope.progress).toEqual(5);
    //     });
     });
});
