angular.module('starter.controllers', [])

    /**************************************** DEBUT AppCtrl ****************************************/
    .controller('AppCtrl', function ($scope, $state, $http) {

/********** POURQUOI TOUTES LES REQUETES SONT EN POST ??? */
        $scope.apiLink = 'http://arthurleroux.fr/API/';
        $scope.currentUser  = {};

        $scope.listData = {};
        $scope.productData = {};
        $scope.userData = {};

        // Nécessaire pour modifier le nom d'une liste
        // Le nom de la variable doit correspondre avec le nom de la ligne list_name en bdd
        $scope.list = {};
        $scope.lists = {};
        $scope.error = "";

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
    })
    /**************************************** FIN AppCtrl ****************************************/

    /**************************************** DEBUT LoginCtrl ****************************************/
    .controller('LoginCtrl', function ($scope, $state, $http) {
        $scope.showRegister = function() {
            $state.go("app.register")
            $scope.error = "";
        };

        $scope.login = function() {

            if ($scope.userData.user_password
                && $scope.userData.user_name) {

                $http.post($scope.apiLink+"User/UserController.php",
                    {
                        type : 'user',
                        action : 'login',
                        user: {
                            user_name : $scope.userData.user_name,
                            user_password : $scope.userData.user_password
                        }
                    })

                    .then(function (res){
                            var response = res.data;

                            if(response.success == true) {
                                $state.go('app.lists');
                                $scope.userData = {};
                                $scope.currentUser = response.user;
                            }
                            else {
                                $scope.error = "Identifiants incorrects";
                                $scope.userData.user_password = "";
                            }
                        },
                        function(error){
                            console.warn('ERROR REGISTER');
                            $scope.userData = {};
                        }
                    );
            }
            else {
                $scope.error = "Erreur : tous les champs n'ont pas étés remplis";
            }
        }
    })
    /**************************************** FIN LoginCtrl ****************************************/

    /**************************************** DEBUT RegisterCtrl ****************************************/
    .controller('RegisterCtrl', function ($scope, $http, $state, $ionicPopup) {
        $scope.register = function() {
            if ($scope.userData.user_password
                && $scope.userData.user_password_confirmation
                && $scope.userData.user_name) {

                if ($scope.userData.user_password == $scope.userData.user_password_confirmation) {
                    $scope.error = "";
                    $http.post($scope.apiLink+"User/UserController.php",
                        {
                            type : 'user',
                            action : 'register',
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
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
                else {
                    $scope.error = "Erreur : les deux mots de passe ne correspondent pas";
                    $scope.userData.user_password_confirmation = "";
                }
            }
            else {
                $scope.error = "Erreur : tous les champs n'ont pas étés remplis";
            }
        };
    })
    /**************************************** FIN RegisterCtrl ****************************************/

    /**************************************** DEBUT ListsCtrl ****************************************/
    .controller('ListsCtrl', function ($scope, $http, $state, $window, $ionicPopup) {


        $scope.showNewList = function(userId) {
            $ionicPopup.show({
                template: '<input type="text" ng-model="listData.list_name">',
                title: 'Nom de la liste à créer',
                scope: $scope,
                buttons: [
                    { text: 'Annuler' },
                    {
                        text: '<b>Ajouter</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.listData.list_name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $http.post($scope.apiLink+"List/ListController.php", {
                                    type : 'list',
                                    action : 'add',
                                    list: {
                                        list_name: $scope.listData.list_name
                                    },
                                    user: {
                                        user_id : userId
                                    }
                                })
                                .then(function (res) {
                                        $state.go('app.lists');
                                        $window.location.reload(true);

                                    },
                                    function(error){
                                        console.warn('ERROR NEW LIST');
                                        console.log(error);
                                    }
                                );
                            }
                        }
                    }
                ]
            });
        };

        $scope.showEditList = function(listId) {

            angular.forEach($scope.lists, function(list)
            {
                if(list.list_id == listId)
                    $scope.list = list;
            });

            $ionicPopup.show({
                template: '<input type="text" ng-model="list.list_name">',
                title: 'Modifier le nom de la liste',
                scope: $scope,
                buttons: [
                    { text: 'Annuler',
                        onTap:  function() {
                            $state.go($state.current, {}, {reload: true})
                        }
                    },
                    {
                        text: '<b>Modifier</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.list.list_name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
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
                        }
                    }
                ]
            });
        };

        $scope.deleteList = function(listId) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Êtes vous sur de supprimer cette liste ?',
                template: "Les collaborateurs de cette liste n'y auront plus accès et tous les produits qu'elle contient seront effacés"
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $http.post($scope.apiLink+"List/ListController.php", {
                        type : 'list',
                        action : 'delete',
                        list: {
                            list_id : listId
                        }
                    })

                    .then(function (res) {
                        $state.go('app.lists');
                        $window.location.reload(true);

                        },
                        function(error){
                            console.warn('ERROR DELETE LIST');
                            console.log(error);
                        }
                    );
                } else {
                    $state.go($state.current, {}, {reload: true});
                }
            });
        }
    })
    /**************************************** FIN ListsCtrl ****************************************/

    /**************************************** DEBUT ListCtrl ****************************************/
    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $ionicPopup, $timeout) {
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

        // Ajouter nouveau collaborateur à la liste
        $scope.showAddUserToList = function(listId) {
            $ionicPopup.show({
                template: '<input type="text" ng-model="userData.user_name">',
                title: 'Nom de la personne à ajouter',
                scope: $scope,
                buttons: [
                    { text: 'Annuler'},
                    {
                        text: '<b>Ajouter</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.userData.user_name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $http.post($scope.apiLink+"User/UserController.php",
                                    {
                                        type : 'user',
                                        action : 'addUserToList',
                                        list: {
                                            list_id : $stateParams['listId']
                                        },
                                        user: {
                                            user_name : $scope.userData.user_name
                                        }
                                    })
                                    .then(function (res){
                                        var response = res.data;
                                        $scope.userData.user_name = "";
                                        console.log(response);
                                        //var alertPopup = $ionicPopup.alert({
                                        //    title: 'Beul',
                                        //    template: response
                                        //});
                                        //$timeout(function() {
                                        //    alertPopup.close(); //close the popup after 3 seconds for some reason
                                        //}, 3000);

                                        }, function(error){
                                            console.warn('ERROR ADD USER TO LIST');
                                            console.log(error);
                                        }
                                    );
                            }
                        }
                    }
                ]
            });
        };

        //  Récupère toutes les listes de l'utilisateur
        $scope.showNewProduct = function(listId) {
            $ionicPopup.show({
                template: '<input type="text" ng-model="productData.product_name">',
                title: 'Nom du produit à ajouter',
                scope: $scope,
                buttons: [
                    { text: 'Annuler',
                        onTap:  function() {
                            $state.go($state.current, {}, {reload: true})
                        }
                    },
                    {
                        text: '<b>Ajouter</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.productData.product_name) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
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
                                            $state.go($state.current, {}, {reload: true});
                                            console.log(response);
                                            $scope.productData.product_name = "";

                                        }, function(error){
                                            console.warn('ERROR ADD PRODUCT');
                                            console.log(error);
                                        }
                                    );
                            }
                        }
                    }
                ]
            });
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

    })
    /**************************************** FIN ListCtrl ****************************************/