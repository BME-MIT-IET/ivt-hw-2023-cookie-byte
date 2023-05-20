Feature: count query parameters

Scenario Outline: total count of the query string parameters.
Given an url "https://webshop.com/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3&SortOrder=dsc"
When count the query parameters
Then the url query number should be "5"