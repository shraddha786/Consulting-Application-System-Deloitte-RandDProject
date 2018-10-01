
describe('Test API Key', () => { 

    var api_key = '4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0';

      it('Test API variable elements', function() {
        expect(api_key).not.toBeNull;
        expect(api_key).not.toBe(true);
        expect(api_key).toBe('4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0');
        expect(api_key).toBeDefined;
    });

      
    it('Test Domain variable elements', () => { 
        var domain = 'sandboxdc705a9195684b13948ef2946002cf14.mailgun.org';
        expect(domain).toContain('mailgun');
        expect(api_key).toBe('4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0');
        expect(api_key).not.toEqual(1);      
    });

    it("The 'toThrow' matcher is for testing if a function throws an exception", function() {
      var foo = function() {
        return api_key;
      };
      var bar = function() {
        return a + 1;
      };
  
      expect(foo).not.toThrow();
      expect(bar).toThrow();
    });

    it("The 'toBeNull' matcher compares against null", function() {
      var a = null;
      var foo = api_key;
  
      expect(null).toBeNull();
      expect(a).toBeNull();
      expect(foo).not.toBeNull();
    });
  
    it("The 'toBeTruthy' matcher is for boolean casting testing", function() {
      var a, foo = 'foo';
  
      expect(foo).toBeTruthy();
      expect(a).not.toBeTruthy();
    });
  
    it("The 'toMatch' matcher is for regular expressions", function() {
      var message = api_key;
  
      expect(message).toMatch(/-/);
      expect(message).not.toMatch('bar');
      expect(message).not.toMatch(/quux/);
    });

    it("The `toBeUndefined` matcher compares against `undefined`", function() {
      var a = {
        foo: api_key
      };
  
      expect(a.foo).not.toBeUndefined();
      expect(a.bar).toBeUndefined();
    });

    describe("jasmine.any", function() {
      it("matches any value", function() {
        expect(api_key).not.toEqual(jasmine.any(Object));
        expect(12).toEqual(jasmine.any(Number));
      });
    });

  });

  