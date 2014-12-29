var socket = io();
var app = angular.module('App', ['ui.bootstrap','ngCookies']);
app.factory("Application",function(){
	var AppData = {};
	return AppData;
});
app.controller("Main", function ($scope, $modal, $cookies, Application) {
    $scope.LoadPage = function (item) {
        $scope.DisplayTemplate = "/tmpls/" + item.templateUrl + ""
    }
    $scope.$watch("Application", function (val) {
        $scope.Menu = [{ "Title": "Home", "templateUrl": "home.html", "Controller": "" }, { "Title": "Page2", "templateUrl": "page2.html", "Controller": "" }];
        $scope.LoadPage($scope.Menu[0]);
    });
    if ($cookies.AppData) {try{$scope.Application = JSON.parse($cookies.AppData);} catch (e) {}}
	$scope.Placeholder = "Place Holder Text";
	$scope.register = function () {
	    var modalInstance = $modal.open({
	        templateUrl: '/tmpls/register.html',
	        controller: function ($scope, $modalInstance, items) {
	            $scope.UserName = "";
	            $scope.UserPass = "";
	            socket.on('Regfail', function (data) {
	                $scope.Message = data.message;
	                $scope.$apply();
	            });
	            socket.on('RegistrationResult', function (data) {
	                var res = { "IsAuthenticated": true, "User": data };
	                $modalInstance.close(res);
	            });
	            $scope.Register = function () {
	                socket.emit('register', { "UserName": $scope.UserName, "FirstName": $scope.FirstName, "LastName": $scope.LastName, "Email": $scope.Email, "UserPass": $scope.UserPass });
	            }
	            $scope.cancel = function () {
	                $modalInstance.close();
	            }
	        },
	        resolve: {
	            items: function () {
	                return $scope.items;
	            }
	        }
	    });
	    modalInstance.result.then(function (result) {
	        $scope.Application = result;
	        $cookies.AppData = JSON.stringify($scope.Application);
	    });
	}
    $scope.logout = function () {
    	$scope.Application = null;
    	$cookies.AppData = null;
    }
    $scope.login = function () {
        var modalInstance = $modal.open({
            templateUrl: '/tmpls/login.html',
            size: 'sm',
            controller: function ($scope, $modalInstance, items) {
                $scope.UserName = "";
                $scope.UserPass = "";
                socket.on('Authfail', function (data) {
                    $scope.Message = data.message;
                    $scope.$apply();
                });
                socket.on('Autheticated', function (data) {
                    var res = {"IsAuthenticated":true,"Token":data.Token};
                    $modalInstance.close(res);
                });
                $scope.Authenticate = function () {
                    socket.emit('authenticate', { "UserName": $scope.UserName, "UserPass": $scope.UserPass });
                }
                $scope.cancel = function () {
                    $modalInstance.close();
                }
            },
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function (result) {
        	$scope.Application = result;
        	$cookies.AppData = JSON.stringify($scope.Application);
          });
        
    }
});
app.controller("Menu", function ($scope, Application) {

    
});
