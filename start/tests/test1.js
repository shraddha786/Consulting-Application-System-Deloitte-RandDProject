

describe("Midway: Testing Modules", function() {
    describe("App Module:", function() {
      var module,mod;
    
      beforeEach(function() {  
        module = angular.module("chirpApp",[]);
      });

      beforeEach(function() {  
        module = angular.module("chirpApp",[]);
      });

      it("should be registered", function() {
        mod= angular.module("chirpApp",[]);
        expect(mod).toBeTruthy();
        expect(mod).not.toBeNull();
      });
      describe("Dependencies:", function() {

        var deps;

        var hasModule = function(m) {
         //var m2=m;
         return deps.indexOf(m)>=0;
        };
       
        beforeEach(function() {
          deps = module.value('chirpApp').requires;
          
        });

        it("should have App.authController as a controller", function() {
          //expect(hasModule('app.authController')).toEqual(true);
        });
        // it("should have App.ismController as a controller", function() {
        //   expect(hasModule('app.ismController')).toEqual(true);
        // });
        // it("should have App.mailController as a Controller", function() {
        //   expect(hasModule('App.mailController')).toEqual(true);
        // });
        // it("should have App.mainController as a Controller", function() {
        //   expect(hasModule('App.mainController')).toEqual(true);
        // });
        // it("should have App.ProgressBarController as a Controller", function() {
        //   expect(hasModule('App.ProgressBarController')).toEqual(true);
        // });
       });
    });
  });