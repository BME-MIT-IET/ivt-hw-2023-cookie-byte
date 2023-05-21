'use strict';

const assert = require('assert');
const fs = require('fs');
const p = require('path');
const Url = require('../url.min.js');

function sanitizeURL(url) {
    var u = new Url(url, true);

    if (u.query['reload']) {
        delete u.query['reload']
    }

    if (u.query['forceReload']) {
        delete u.query['forceReload']
    }

    if (u.query['device']) {
        delete u.query['device']
    }

    if (u.query['testwebid']) {
        delete u.query['testwebid']
    }

    if (u.query['testWebId']) {
        delete u.query['testWebId']
    }

    if (u.query['testWebID']) {
        delete u.query['testWebID']
    }

    if (u.query['timetravel']) {
        delete u.query['timetravel']
    }

    return u.toString();
}

describe('Url()', function () {
    it('should construct an oobject', function () {
        const u = new Url();
        assert.equal(u instanceof Url, true);
    });

    it('should match current dir when construct with no argument', function () {
        const u = new Url();
        let dir = u.path.replace(/\//g, p.sep);
        process.platform.match(/^win/) && (dir = dir.substr(1));
        assert.equal(dir, fs.realpathSync('.'));
    });
    it('should keep URL without transformations if requested', function () {
        assert.equal(
            sanitizeURL('/SearchResults?search=new&make=Buick&year=2016&forceReload=true'),
            '/SearchResults?search=new&make=Buick&year=2016'
        );
    });
    it('should test absolutize url', function () {
        const absoluteUrl = new Url('/foo');
        assert.equal(absoluteUrl.toString(), 'file:///foo');

        const noTransform = new Url('/foo', true);
        assert.equal(noTransform.toString(), '/foo');
    });
});

describe('Url.clearQuery()', function () {
    it('should remove all vars from query string', function () {
        const url = new Url('http://example.com/?a&a=&b=&c=&d=&e=&f=&g=&h#foo');
        url.clearQuery();
        assert.equal('http://example.com/#foo', url.toString());
    });
    it('should remove all query parameters from the URL', function () {
        const url = new Url('http://example.com/?param1=value1&param2=value2&param3=value3');
        url.clearQuery();
        assert.equal(url.toString(), 'http://example.com/');
    });
    
      it('should preserve other parts of the URL', function () {
        const url = new Url('http://example.com/path?param1=value1#fragment');
        url.clearQuery();
        assert.equal(url.toString(), 'http://example.com/path#fragment');
    });
    
      it('should not modify the URL if it does not have any query parameters', function () {
        const url = new Url('http://example.com/');
        url.clearQuery();
        assert.equal(url.toString(), 'http://example.com/');
    });
});

describe('Url.encode(), Url.decode()', function () {
    it('should correctly encode and decode query string params', function () {
        var url1 = new Url('http://localhost/?a=%3F').toString();
        var url2 = new Url('http://localhost/?a=%3f').toString();
        assert.equal(url1.toLowerCase(), url2.toLowerCase());
    });
});

describe('Url.queryLength()', function () {
    it('should correctly return correct query lengths', function () {
        let url = new Url('http://localhost/?a=%3F');
        let queryLength = url.queryLength();
        assert.equal(queryLength, 1);

        url = new Url('http://localhost/');
        queryLength = url.queryLength();
        assert.equal(queryLength, 0);

        url = new Url('http://localhost/?a=%3F&test=this&hello=world');
        queryLength = url.queryLength();
        assert.equal(queryLength, 3);
    });
    
    it('should count each query parameter once, even if it appears multiple times', function () {
        const url = new Url('http://example.com/?param1=value1&param1=value2&param1=value3');
        const queryLength = url.queryLength();
        assert.equal(queryLength, 1);
    });

});

describe('Url.query.toString()', function () {
    it('should maintain name for null values, and drop them for undefined values', function () {
        const originalStr = 'http://localhost/path?alice=123&bob=&carol'
        const u = new Url(originalStr);
        assert.equal(u.query['alice'], '123');
        assert.equal(u.query['bob'], '');
        assert.equal(u.query['carol'], null);
        assert.equal(u.query['dave'], undefined);
        assert.equal(u.toString(), originalStr);

        u.query['eve'] = null;
        assert.equal(u.toString(), originalStr + '&eve');
        u.query['eve'] = undefined;
        assert.equal(u.toString(), originalStr);

        u.query['frank'] = 'foo';
        assert.equal(u.toString(), originalStr + '&frank=foo');
        delete u.query.frank;
        assert.equal(u.toString(), originalStr);
    });

    it('should maintain name for null values in arrays, and skip undefined values', function () {
        const originalStr = 'http://localhost/?a&a&a';
        const u = new Url(originalStr);
        assert.equal(u.query.toString(), 'a&a&a');
        assert.equal(u.query.a instanceof Array, true);
        assert.equal(u.query.a[0], null);
        assert.equal(u.query.a[1], null);
        assert.equal(u.query.a[2], null);
        assert.equal(u.queryLength(), 1);
        assert.equal(u.toString(), originalStr);

        u.query.a[1] = undefined;
        assert.equal(u.toString(), 'http://localhost/?a&a');

        u.query.a[1] = 'foo';
        assert.equal(u.toString(), 'http://localhost/?a&a=foo&a');

        u.query.a[1] = undefined;
        assert.equal(u.toString(), 'http://localhost/?a&a');

        u.query.a[1] = null;
        assert.equal(u.toString(), originalStr);
    });

    it('should produce an empty value for an empty array property in the query string', function () {
        const originalUrl = 'http://localhost/?a&a&a';
        const url = new Url(originalUrl);
      
        url.query.a = [];
      
        const expectedUrl = 'http://localhost/?a=';
        assert.equal(url.toString(), expectedUrl);
      });
});

describe('Url props interface', function () {
    it('should parse all URL parts correctly', function () {
        const str = 'wss://user:pass@example.com:9999/some/path.html?foo=bar#anchor';
        const u = new Url(str);
        assert.equal(u.protocol, 'wss');
        assert.equal(u.user, 'user');
        assert.equal(u.pass, 'pass');
        assert.equal(u.host, 'example.com');
        assert.equal(u.port, '9999');
        assert.equal(u.path, '/some/path.html');
        assert.equal(u.query, 'foo=bar');
        assert.equal(u.query.foo, 'bar');
        assert.equal(u.hash, 'anchor');
        assert.equal(str, u.toString());
    });

    it('should correctly parse and return the URL properties', function () {
        const url = new Url('https://example.com:8080/path/to/resource?param1=value1#fragment');
    
        assert.equal(url.protocol, 'https');
        assert.equal(url.host, 'example.com');
        assert.equal(url.port, '8080');
        assert.equal(url.path, '/path/to/resource');
        assert.equal(url.query, 'param1=value1');
        assert.equal(url.hash, 'fragment');
      });
});

describe('Path url encoding', function () {
    it('should correctly encode whitespace as %20', function () {
        const u = new Url('http://localhost/path with space');
        assert.equal(u.toString(), 'http://localhost/path%20with%20space');
    });
    // TODO: Fix https://github.com/Mikhus/domurl/issues/49
    xit('should correctly encode Plus Sign (+) to %2b in path.', function () {
        const u = new Url('http://localhost/path+with+plus');
        assert.equal(u.toString(), 'http://localhost/path%2bwith%2bplus');
    });
    xit('should preserve Plus Sign (+) in path.', function () {
        const u = new Url('http://localhost/path+with+plus');
        assert.equal(u.toString(), 'http://localhost/path%2bwith%2bplus');
    });
    it('should correctly encode random characters in the path', function () {
        const url = new Url('http://example.com/my-path/ḟøø-ßαя');
        const expectedUrl = 'http://example.com/my-path/%E1%B8%9F%C3%B8%C3%B8-%C3%9F%CE%B1%D1%8F';
        assert.equal(url.toString(), expectedUrl);
      });      
    it('should correctly encode random characters in the path', function () {
        const url = new Url('http://example.com/my-path/႓ለሊ');
        const expectedUrl = 'http://example.com/my-path/%E1%82%93%E1%88%88%E1%88%8A';
        assert.equal(url.toString(), expectedUrl);
    })
      
});

describe('Path url decoding', function () {
    it('should preserve non-existing characters (2-HEX)', function () {
      const url = new Url('http://example.com/path-with-%C1%80');
      const expectedUrl = 'http://example.com/path-with-%C1%80';
      assert.equal(Url.prototype.decode(url.toString()), expectedUrl);
    });
  
    it('should preserve non-existing characters (3-HEX)', function () {
      const url = new Url('http://example.com/path-with-%E0%80%80');
      const expectedUrl = 'http://example.com/path-with-%E0%80%80';
      assert.equal(Url.prototype.decode(url.toString()), expectedUrl);
    });
  });

describe('Url.isEmptyQuery()', function () {
    it('should return true if no parameters in the query string', function () {
        const urlWithParams = new Url('http://example.com/?key1=value1');
        const urlWithoutParams = new Url('http://example.com/');
      
        const hasParams = urlWithParams.isEmptyQuery();
        const noParams = urlWithoutParams.isEmptyQuery();
      
        assert.equal(hasParams, false);
        assert.equal(noParams, true);
      });
      

    it('should handle empty query string', function () {
        const url = new Url('http://localhost/?');
        assert.equal(url.isEmptyQuery(), true);
    });

    it('should handle empty parameter values correctly', function () {
        const url = new Url('http://example.com/?param1=&param2=&param3=');
        const isEmpty = url.isEmptyQuery();
        assert.equal(isEmpty, false);
    });
});

describe('Url.toString()', function () {
    it('should return the string representation of the URL', function () {
      const url = new Url('https://example.com:8080/path/to/resource?param1=value1#fragment');
      const urlString = url.toString();
      assert.equal(urlString, 'https://example.com:8080/path/to/resource?param1=value1#fragment');
    });
});