// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'AppCtrl'
            })

/**************************************** AUTH ****************************************/

            .state('app.register', {
                url: '/register',
                views: {
                    'menuContent' : {
                        templateUrl: 'templates/auth/register.html',
                        controller: "RegisterCtrl"
                    }
                }
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/auth/login.html',
                        controller: "LoginCtrl"
                    }
                }
            })

/**************************************** LIST ****************************************/

            .state('app.lists', {
                url: '/lists',
                views: {
                    'menuContent' : {
                        templateUrl: 'templates/list/lists.html',
                        controller: 'ListsCtrl'
                    }
                }
            })

            .state('app.single', {
                url: '/lists/:listId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/list/list.html',
                        controller: 'ListCtrl'
                    }
                }
            })

/**************************************** PRODUCT ****************************************/

            .state('app.new_product', {
                url: '/new_product/:listId',
                views: {
                    'menuContent' : {
                        templateUrl: 'templates/product/new_product.html',
                        controller: "NewProductCtrl"
                    }
                }
            })

/**************************************** USER ****************************************/

            .state('app.add_user_to_list', {
                url: '/add_user_to_list/:listId',
                views: {
                    'menuContent' : {
                        templateUrl: 'templates/user/add_user_to_list.html',
                        controller: "AddUserToListCtrl"
                    }
                }
            });

        //if(window.currentUserId = 1) {
            $urlRouterProvider.otherwise('/app/lists');
        /*}
        else{
            $urlRouterProvider.otherwise('/app/login');
        }*/

    });

