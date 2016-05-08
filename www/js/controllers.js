angular.module('starter.controllers', [])

/**************************************** GLOBAL ****************************************/

    .controller('AppCtrl', function ($scope, $http) {

        $scope.currentUser = {
            id: 1
        };

        $scope.listData = {};
        $scope.productData= {};

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

/**************************************** AUTH ****************************************/

    .controller('LoginCtrl', function ($scope) {

    })

    .controller('RegisterCtrl', function ($scope) {

    })

/**************************************** LIST ****************************************/

    .controller('ListsCtrl', function ($scope, $http, $state) {

        $scope.showNewList = function() {
            $state.go("app.new_list")
        }


        $scope.showEditList = function(listId) {
            $state.go("app.edit_list", {listId : listId});
        }

        $scope.deleteList = function(listId) {
            console.log("DELETE LIST" + listId);
            $http.post($scope.apiLink+"List/ListController.php",
                {
                    type : 'list',
                    action : 'delete',
                    list: {
                        list_id : listId
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $state.go('app.lists', {}, {reload: true});
                        //$window.location.reload(true);
                        console.log(response);


                    }, function(error){
                        console.warn('ERROR DELETE LIST');
                        console.log(error);
                    }
                );
        }
    })

    .controller('EditListCtrl', function ($scope, $stateParams, $http, $state, $window) {
        $http.post($scope.apiLink+"List/ListController.php",
            {
                type : 'list',
                action : 'find',
                list: {
                    list_id : $stateParams['listId']
                }
            })

            .then(function (res){
                    var response = res.data;
                    $scope.list = response;
                    console.log($scope.list);

                }, function(error){
                    console.warn('ERROR FIND LIST');
                    console.log(error);
                }
            );
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
                    $state.go("app.single", {listId : response})
                    console.log(response);


                }, function(error){
                    console.warn('ERROR NEW LIST');
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

/**************************************** PRODUCT ****************************************/

    .controller('NewProductCtrl', function ($scope, $stateParams, $http, $state) {

        $scope.addProduct = function() {
            console.log('ADD PRODUCT');
            // Créer un nouveau produit dans la list listId
            $http.post($scope.apiLink+"Product/ProductController.php",
                {
                    type : 'product',
                    action : 'add',
                    product: {
                        product_name : $scope.productData.product_name
                    },
                    list: {
                        list_id : $stateParams['listId']
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $state.go("app.single", {listId : response})
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