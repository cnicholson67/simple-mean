var socket = io();
var app = angular.module('App', ['ui.bootstrap']);
app.controller("Main",function($scope){
    $scope.Placeholder = "Place Holder Text";
});
app.controller("Menu",function($scope){
    $scope.MenuText = "Here is Menu Text";
});
