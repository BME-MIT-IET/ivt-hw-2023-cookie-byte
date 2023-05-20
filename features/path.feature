Feature: Manipulate path

Scenario Outline: convert path to string
Given an url "https://google.com/home"
When change the path of url to string
Then the url will be "https://google.com/home"