Feature: check if there is no query parameters

Scenario: Returns true if query string contains no parameters
Given an url "https://webshop.com/Products/List"
When check if the url has no query parameters
Then the result should be "true"

Scenario: false otherwise.
Given an url "https://webshop.com/Products/List?SortDirection=dsc&Sort=price&Page=3&Page2=3&SortOrder=dsc"
When check if the url has no query parameters
Then the result should be "false"

