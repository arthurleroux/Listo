angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.lists = [
            {title: 'Ziland', id: 1},
            {title: 'Ziland LDC', id: 2},
            {title: 'Chill', id: 3}
        ];

    })

    .controller('LoginCtrl', function ($scope) {

    })

    .controller('RegisterCtrl', function ($scope) {

    })

    .controller('ListsCtrl', function ($scope, $state) {
        $scope.showNewList = function() {
            $state.go("app.new_list")
        }
    })

    .controller('NewListCtrl', function ($scope) {
    })

    .controller('ListCtrl', function ($scope, $stateParams, $http, $state) {

        $scope.showNewProduct = function(listId) {
            $state.go("app.new_product", {listId : listId})
        }

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

                if ('error' in response){

                    $scope.errorForm = response.error;
                }
                else if ('success' in response){
                    console.log("SUCCESS REQUEST");
                    console.log(res);
                }

            }, function(error){
                console.warn('ERROR FIND ALL LIST');
                console.log(error);
            }
        );
    })

    .controller('NewProductCtrl', function ($scope, $stateParams) {
        console.log($stateParams);
    });