const assert = require('assert')
const { Given, When, Then, Before } = require('@cucumber/cucumber')
const Url = require('../url.js');
var urlString;
var urlremovedquery;
var queryNum;
var isEmptyQuery;

Given('an url {string}', (url) => this.url = new Url(url))

When('change the path of url to string', () => {
    urlString = this.url.toString();
})
Then('the url will be {string}', (parameter) => assert.strictEqual(urlString, parameter))

When('remove the query', () => {
    urlremovedquery = this.url.clearQuery();
})
Then('the url should be {string}', (parameter) => assert.strictEqual(urlremovedquery.toString(), parameter))

When('count the query parameters', () =>{
    queryNum = this.url.queryLength();
})

Then('the url query number should be {string}', (parameter) => assert.strictEqual(Number(parameter), queryNum))

When('check if the url has no query parameters', () =>{
    isEmptyQuery = this.url.isEmptyQuery();
})

Then('the result should be {string}', (parameter) => assert.strictEqual(Boolean(parameter), isEmptyQuery))
