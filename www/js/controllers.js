angular.module('starter.controllers', [])

    /**************************************** DEBUT AppCtrl ****************************************/
    .controller('AppCtrl', function ($scope, $http) {

        $scope.currentUser = {
            id: 1
        };

        $scope.listData = {};
        $scope.productData = {};
        $scope.userData = {};

        // Nécessaire pour modifier le nom d'une liste
        // Le nom de la variable doit correspondre avec le nom de la ligne list_name en bdd
        $scope.list = {};

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.lists = {};

        $scope.error = "";


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
    /**************************************** FIN AppCtrl ****************************************/

    /**************************************** DEBUT LoginCtrl ****************************************/
    .controller('LoginCtrl', function ($scope, $state) {
        $scope.showRegister = function() {
            $state.go("app.register")
        }
    })
    /**************************************** FIN LoginCtrl ****************************************/

    /**************************************** DEBUT RegisterCtrl ****************************************/
    .controller('RegisterCtrl', function ($scope, $http, $state) {
        $scope.register = function() {
            if ($scope.userData.user_password
                && $scope.userData.user_password_confirmation
                && $scope.userData.user_name) {

                if ($scope.userData.user_password == $scope.userData.user_password_confirmation) {
                    $scope.error = "";
                    $http.post($scope.apiLink+"User/UserController.php",
                        {
                            type : 'user',
                            action : 'add',
                            user: {
                                user_name : $scope.userData.user_name,
                                user_password : $scope.userData.user_password
                            }
                        })

                        .then(function (res){
                                var response = res.data;
                                if(response.success == true) {
                                    $state.go('app.login');
                                    $scope.userData = {};
                                }
                                else {
                                    $scope.error = "Ce pseudo est déjà utilisé";
                                }

                            },
                            function(error){
                                console.warn('ERROR REGISTER');
                                console.log(error);
                            }
                        );
                }
                else {
                    $scope.error = "Erreur : les deux mots de passe ne correspondent pas";
                }
            }
            else {
                $scope.error = "Erreur : tous les champs n'ont pas été remplis";
            }
        };
    })
    /**************************************** FIN RegisterCtrl ****************************************/

    /**************************************** DEBUT ListesCtrl ****************************************/
    .controller('ListsCtrl', function ($scope, $http, $state, $window) {

        $scope.showNewList = function() {
            $state.go("app.new_list")
        }

        $scope.showEditList = function(listId) {
            $state.go("app.edit_list", {listId : listId});
        }

        $scope.deleteList = function(listId) {
            console.log("DELETE LIST" + listId);
            $http.post($scope.apiLink+"List/ListController.php", {
                    type : 'list',
                    action : 'delete',
                    list: {
                        list_id : listId
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $state.go('app.lists');
                        $window.location.reload(true);
                        console.log(response);


                    }, function(error){
                        console.warn('ERROR DELETE LIST');
                        console.log(error);
                    }
                );
        }
    })
    /**************************************** FIN ListsCtrl ****************************************/

    /**************************************** DEBUT EditListCtrl ****************************************/
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

        $scope.editList = function(listId) {
            $http.post($scope.apiLink+"List/ListController.php",
                {
                    type : 'list',
                    action : 'update',
                    list: {
                        list_id : listId,
                        list_name: $scope.list.list_name
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $state.go("app.lists");
                        $window.location.reload(true);
                        console.log(response);

                    }, function(error){
                        console.warn('ERROR UPDATE LIST');
                        console.log(error);
                    }
                );
        }
    })
    /**************************************** FIN EditListCtrl ****************************************/

    /**************************************** DEBUT NewListCtrl ****************************************/
    .controller('NewListCtrl', function ($scope, $state, $http, $window) {

        $scope.createList = function(userId) {

            if ($scope.listData.list_name) {
                $scope.error = "";
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
                            $state.go('app.lists');
                            $window.location.reload(true);
                            console.log(response);

                        }, function(error){
                            console.warn('ERROR NEW LIST');
                            console.log(error);
                        }
                    );
            }
            else {
                $scope.error = "Erreur : le nom de la liste est vide"
            }
        }

    })
    /**************************************** FIN NewListCtrl ****************************************/

    /**************************************** DEBUT ListCtrl ****************************************/
    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $window) {

        // Ajouter nouveau collaborateur à la liste
        $scope.addCollaborator = function() {
            $state.go("app.add_user_to_list")
        }
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
        };

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
    /**************************************** FIN ListCtrl ****************************************/

    /**************************************** DEBUT NewProductCtrl ****************************************/
    .controller('NewProductCtrl', function ($scope, $stateParams, $http, $state) {

        $scope.addProduct = function() {
            if ($scope.productData.product_name) {
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
                            $state.go("app.single", {listId : response});
                            console.log(response);
                            $scope.productData.product_name = "";

                        }, function(error){
                            console.warn('ERROR ADD PRODUCT');
                            console.log(error);
                        }
                    );
                }
            else {
                $scope.error = "Erreur : le nom du produit est vide"
            }
        };
    })
    /**************************************** FIN NewProductCtrl ****************************************/

    /**************************************** DEBUT AddUserToListCtrl ****************************************/
    .controller('AddUserToListCtrl', function ($scope) {

    });
    /**************************************** FIN AddUserToListCtrl ****************************************/