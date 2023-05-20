Feature: remove query

Scenario Outline: remove query form a url
Given an url "https://webshop.com/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3&SortOrder=dsc"
When remove the query
Then the url should be "https://webshop.com/Products/List"