angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http) {

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.lists = {};

        // Récupère toutes les listes de l'utilisateur
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
                $scope.lists = response;

            }, function(error){
                console.warn('ERROR FIND ALL LIST');
                console.log(error);
            }
        );
        // / Récupère toutes les listes de l'utilisateur

    })

    .controller('LoginCtrl', function ($scope) {

    })

    .controller('RegisterCtrl', function ($scope) {

    })

    .controller('ListsCtrl', function ($scope, $http, $state) {

        $scope.showNewList = function() {
            $state.go("app.new_list")
        }
    })

    .controller('NewListCtrl', function ($scope) {
    })

    .controller('ListCtrl', function ($scope, $stateParams, $http, $state) {

        // Récupère tous les produits de la liste
        $http.post($scope.apiLink+"Product/ProductController.php",
            {
                type : 'product',
                action : 'findAll',
                list: {
                    list_id : $stateParams['listId']
                }
            })

            .then(function (res){
                var response = res.data;
                $scope.products = response;
                console.log($scope.products);

            }, function(error){
                console.warn('ERROR FIND ALL LIST');
                console.log(error);
            }
        );
        // / Récupère toutes les listes de l'utilisateur

        $scope.showNewProduct = function(listId) {
            $state.go("app.new_product", {listId : listId})
        }

        angular.forEach($scope.lists, function(list)
        {
            if(list.list_id == $stateParams['listId'])
                $scope.list = list;
        });

        //$scope.products =  [
        //    {name: 'JackDa'},
        //    {name: 'Weed'},
        //    {name: 'Ricard'}
        //];
    })

    .controller('NewProductCtrl', function ($scope, $stateParams) {
        console.log($stateParams);
    });