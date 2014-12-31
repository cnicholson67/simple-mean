var socket = io();
var app = angular.module('App', ['ui.bootstrap', 'ngCookies', 'ngRoute', 'ngAnimate']);
app.factory("Application",function(){
	var AppData = {};
	return AppData;
});
app.controller("Main", function ($scope, $modal, $cookies, $http, Application) {
    function resetMenu() {
        angular.forEach($scope.Menu, function (i) {
            i.class = "";
        });
    }
    function getMenu(){
        socket.emit('getmenu', $scope.Application, function (menu) {
            $scope.Menu = menu;
            $scope.$apply();
            if ($cookies.LastPage) {
                var lp = JSON.parse($cookies.LastPage);
                //console.log(lp)
                var pageselected = false;
                angular.forEach($scope.Menu, function (itm, idx) {
                    if (itm.Title == lp.Title) {
                        pageselected = true;
                        $scope.LoadPage($scope.Menu[idx]);
                    }
                });
                if (pageselected == false) {
                    $scope.LoadPage($scope.Menu[0]);
                }
            } else {
                $scope.LoadPage($scope.Menu[0]);
            }
        });
    }
    $scope.LoadPage = function (item) {
        resetMenu();
        item.class = "active";
        $scope.EditProfileClass = "";
        $cookies.LastPage = JSON.stringify(item);
        $scope.DisplayTemplate = "/tmpls/" + item.templateUrl + ""
    }
    $scope.$watch("Application", function (val) {
        getMenu();
    });

    if ($cookies.AppData) {
        try {
            $scope.Application = JSON.parse($cookies.AppData);
            socket.emit('userdata', $scope.Application.User._id, function (data) {
                $scope.Application.User = data;
            });
        } catch (e) { }
    } 
    getMenu();
    $scope.EditProfile = function () {
        resetMenu();
        $scope.EditProfileClass = "active";
        $scope.DisplayTemplate = "/tmpls/profile.html"
    }
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
                socket.on('Authenticated', function (data) {
                    var res = {"IsAuthenticated": true,"User":data};
                    $modalInstance.close(res);
                });
                $scope.Authenticate = function () {
                    socket.emit('authenticate', { "UserName": $scope.UserName, "UserPass": $scope.UserPass });
                }
                $scope.CheckKey = function (e) {
                    if (e.keyCode == 13) {
                        $scope.Authenticate();
                    }
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
app.controller("AdminTabs", function ($scope, $modal, $cookies, $http, Application) {

});
