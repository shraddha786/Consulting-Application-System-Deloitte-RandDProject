
describe('Test API Key', () => { 
    var a;

    var api_key = '4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0';

      it('Test dom elements', function() {
        var domain = 'sandboxdc705a9195684b13948ef2946002cf14.mailgun.org';
        expect(api_key).not.toBeNull;
        expect(domain).toContain('mailgun');
    });

      
    it('tests api key', () => { 
        a=true;
        expect(a).toBe(true);
        expect(api_key).toBe('4a94b9ddc7e28006170e29b9e7ab5a0b-8889127d-d9d89be0');
        expect(api_key).toBeDefined;
    });


  });