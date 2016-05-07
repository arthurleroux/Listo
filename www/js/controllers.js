angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http) {

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.lists = {};

        $http.post($scope.apiLink+"List/ListController.php",
            {
                type : 'list',
                action : 'findAll',
                user: {
                    user_id : 1
                }
            })

            .then(function (res){
                var response = res.data;
                console.log(response);
                $scope.lists = response;

            }, function(error){
                console.warn('ERROR FIND ALL LIST');
                console.log(error);
            }
        );

        //$scope.lists = [
        //    {title: 'Ziland', id: 1},
        //    {title: 'Ziland LDC', id: 2},
        //    {title: 'Chill', id: 3}
        //];


    })

    .controller('LoginCtrl', function ($scope) {

    })

    .controller('RegisterCtrl', function ($scope) {

    })

    .controller('ListsCtrl', function ($scope, $http, $stateParams) {
        console.log('LISTS CONTROLLER');

        console.log($scope.lists);
        setTimeout(function(){
            console.log($scope.lists);
        }, 2000);
    })

    .controller('NewListCtrl', function ($scope) {

    })

    .controller('ListCtrl', function ($scope, $stateParams, $http) {
        angular.forEach($scope.lists, function(list)
        {
            if(list.id == $stateParams['listId'])
                $scope.list = list;
        });

        // REQUETE AJAX

        // RETOUR REQUETE

        $scope.products =  [
            {name: 'JackDa'},
            {name: 'Weed'},
            {name: 'Ricard'}
        ];
    })

    .controller('NewProductCtrl', function ($scope) {

    });