

describe('authController', function() {

    var $controller;

 //   beforeEach(module('chirpApp',['ngRoute', 'ngResource', 'ngCookies', 'ngAnimate', 'ui.bootstrap', 'angular-scroll-animate']));

    beforeEach(inject(function(_$controller_){
        $controller=_$controller_;
     
    }));

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
    // });
});
