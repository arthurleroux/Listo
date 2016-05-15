angular.module('starter.controllers', ['ngStorage'])

    /**************************************** DEBUT AppCtrl ****************************************/
    .controller('AppCtrl', function ($scope, $state, $http, $localStorage, $window) {

        /********** POURQUOI TOUTES LES REQUETES SONT EN POST ??? */
        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.listData = {};
        $scope.productData = {};
        $scope.userData = {};

        // Nécessaire pour modifier le nom d'une liste
        // Le nom de la variable doit correspondre avec le nom de la ligne list_name en bdd
        $scope.list = {};
        $scope.lists = {};
        $scope.error = "";

        if ($localStorage.currentUser !== 0) {
            $http.post($scope.apiLink+"List/ListController.php", {
                    type : 'list',
                    action : 'findAll',
                    user: {
                        user_id : $localStorage.currentUser.user_id
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $scope.lists = response;
                        if (Object.keys($scope.lists).length == 0) {
                            $scope.listsEmpty = true;
                        }
                        else {
                            $scope.listsEmpty = false;
                        }

                    },
                    function(error){
                        console.warn('ERROR FIND ALL LIST');
                        console.log(error);
                    }
                );
        }

        $scope.logout = function () {
            $localStorage.currentUser = 0;
            $state.go('app.login');
            $window.location.reload(true);
        };

        //Rend la variable accessible depuis les vues
        $scope.currentUser = $localStorage.currentUser;

    })
    /**************************************** FIN AppCtrl ****************************************/

    /**************************************** DEBUT LoginCtrl ****************************************/
    .controller('LoginCtrl', function ($scope, $state, $http, $ionicHistory, $localStorage, $window) {
        if ($localStorage.currentUser !== 0) {
            $state.go('app.lists');
            $window.location.reload(true);
        }

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $scope.showRegister = function() {
            $state.go("app.register");
            $scope.error = "";
            $scope.userData = {};
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
                                $window.location.reload(true);
                                $scope.userData = {};
                                $localStorage.currentUser = response.user;
                                console.log($localStorage.currentUser);
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
    .controller('RegisterCtrl', function ($scope, $http, $state, $ionicHistory, $ionicPopup) {

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

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
                                    $ionicPopup.alert({
                                        title: "Votre compte a bien été créé",
                                        buttons: [
                                            {
                                                text: 'Ok',
                                                type: 'button-positive',
                                                onTap: function () {
                                                    $state.go('app.login');
                                                    $scope.userData = {};
                                                }
                                            }
                                        ]
                                    });

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
    .controller('ListsCtrl', function ($scope, $http, $state, $window, $ionicPopup, $localStorage) {

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
            $ionicPopup.confirm({
                title: 'Êtes vous sur de supprimer cette liste ?',
                template: "Les collaborateurs de cette liste n'y auront plus accès et tous les produits qu'elle contient seront effacés",

                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current, {}, {reload: true});
                        }
                    },
                    {
                        text: 'Oui',
                        type: 'button-assertive',
                        onTap: function() {
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
                        }
                    }
                ]
            });
        }
    })
    /**************************************** FIN ListsCtrl ****************************************/

    /**************************************** DEBUT ListCtrl ****************************************/
    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $ionicPopup, $localStorage) {
        // Récupère tous les produits de la liste
        $http.post($scope.apiLink+"Product/ProductController.php", {
                type : 'product',
                action : 'findAll',
                list: {
                    list_id : $stateParams['listId']
                }
            })

            .then(function (res){
                    var response = res.data;
                    $scope.products = response;
                    if (Object.keys($scope.products).length == 0) {
                        $scope.listEmpty = true;
                    }
                    else {
                        $scope.listEmpty = false;
                    }

                }, function(error){
                    console.warn('ERROR FIND ALL LIST');
                    console.log(error);
                }
            );

        $scope.showInfos = function(productId) {
            angular.forEach($scope.products, function(product)
            {
                if(product.product_id == productId)
                    $scope.product = product;
            });
            if ($scope.product.product_status == "Achete") {
                $scope.info = ", et acheté par " + $scope.product.by_user_name;
            }
            else if ($scope.product.product_status == 'Pris en charge') {
                $scope.info = ", et pris en charge par " + $scope.product.by_user_name;
            }
            else if ($scope.product.product_status == "En attente") {
                $scope.info = ", et en attente";
            }
            $ionicPopup.alert({
                title: "Informations sur " + '"' + $scope.product.product_name + '"',
                template: "Produit ajouté par " + $scope.product.user_name + $scope.info
            })
        };

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
                                            if (response.deja == true) {
                                                $scope.message = "Cet utilisateur fait déjà parti de cette liste";
                                            }
                                            else if (response.inconnu == true) {
                                                $scope.message = "Ce pseudo ne correspond à aucun utilisateur";
                                            }
                                            else {
                                                $scope.message = "Utilisateur ajouté à cette liste avec succès !"
                                            }
                                            $scope.userData.user_name = "";
                                            console.log(response);
                                            $ionicPopup.alert({
                                                title: $scope.message
                                            });
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
                                        },
                                        user: {
                                            user_name : $localStorage.currentUser.user_name
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

        $scope.updateProduct = function(productId, action) {
            $http.post($scope.apiLink+"Product/ProductController.php", {
                    type : 'product',
                    action : 'update',
                    product: {
                        product_id : productId,
                        product_status: action
                    },
                    user: {
                        by_user_name: $localStorage.currentUser.user_name
                    }
                })

                .then(function (res){
                        var response = res.data;
                        $state.go($state.current, {}, {reload: true});
                        console.log(response);

                    }, function(error){
                        console.warn('ERROR UPDATE PRODUCT');
                        console.log(error);
                    }
                );
        };

        $scope.deleteProduct = function(productId) {
            $ionicPopup.confirm({
                title: 'Êtes vous sur de supprimer cet article ?',
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current, {}, {reload: true});
                        }
                    },
                    {
                        text: 'Oui',
                        type: 'button-assertive',
                        onTap: function() {
                            $http.post($scope.apiLink+"Product/ProductController.php", {
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
                    }
                ]
            });
        };


        angular.forEach($scope.lists, function(list)
        {
            if(list.list_id == $stateParams['listId'])
                $scope.list = list;
        });

    });
    /**************************************** FIN ListCtrl ****************************************/