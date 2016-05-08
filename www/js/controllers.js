angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $http) {

        $scope.currentUser = {
            id: 1
        };

        $scope.listData = {};

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

    .controller('NewListCtrl', function ($scope, $state, $http) {

        $scope.createList = function(userId) {

            console.warn('user id :' + userId);
            $http.post($scope.apiLink+"List/ListController.php",
                {
                    type : 'list',
                    action : 'add',
                    list: {
                        list_name: $scope.listData.list_name
                    },
                    user: {
                        user_id : userId
                    }
                })

                .then(function (res){
                    var response = res.data;
                    //$state.go("app.single", {listId : response.list_id})
                    console.log(response);


                }, function(error){
                    console.warn('ERROR DELETE PRODUCT');
                    console.log(error);
                }
            );

        }

    })

    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $window) {

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

        $scope.deleteProduct = function(productId) {
            $http.post($scope.apiLink+"Product/ProductController.php",
                {
                    type : 'product',
                    action : 'delete',
                    product: {
                        product_id : productId
                    }
                })

                .then(function (res){
                    var response = res.data;
                    $state.go($state.current, {}, {reload: true});
                    //$window.location.reload(true);
                    console.log(response);


                }, function(error){
                    console.warn('ERROR DELETE PRODUCT');
                    console.log(error);
                }
            );
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

        $scope.addProduct = function() {

            // Créer un nouveau produit dans la list listId
            $http.post($scope.apiLink+"Product/ProductController.php",
                {
                    type : 'product',
                    action : 'add',
                    list: {
                        list_id : $stateParams['listId']
                    }
                })

                .then(function (res){
                        var response = res.data;
                        console.log(response);

                    }, function(error){
                        console.warn('ERROR ADD PRODUCT');
                        console.log(error);
                    }
                );
            // / Créer un nouveau produit dans la list listId

        }

        console.log($stateParams);
    });