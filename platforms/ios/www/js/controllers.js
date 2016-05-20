angular.module('starter.controllers', ['ngStorage'])

    /**************************************** DEBUT AppCtrl ****************************************/
    .controller('AppCtrl', function ($scope, $state, $http, $localStorage, $window) {

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.listData = {};
        $scope.productData = {};
        $scope.userData = {};

        // Nécessaire pour modifier le nom d'une liste
        // Le nom de la variable doit correspondre avec le nom de la ligne list_name en bdd
        $scope.list = {};
        $scope.lists = {};
        $scope.error = "";

        if (angular.isDefined($localStorage.currentUser)) {
            $scope.logged = true;
        }
        else {
            $scope.logged = false;
        }

        $scope.doRefresh = function() {
            $state.go($state.current, {}, {reload: true});
        };

        //Rend la variable accessible depuis les vues
        if (angular.isDefined($localStorage.currentUser)) {
            $scope.currentUser = $localStorage.currentUser;
        }

        $scope.logout = function () {
            $localStorage.$reset();
            $state.go('app.login');
            $window.location.reload(true);
        };
    })
    /**************************************** FIN AppCtrl ****************************************/

    /**************************************** DEBUT LoginCtrl ****************************************/
    .controller('LoginCtrl', function ($scope, $state, $http, $ionicHistory, $localStorage, $window, $timeout) {
        if (angular.isDefined($localStorage.currentUser)) {
            $state.go('app.lists');
            //$window.location.reload(true);
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
                            //alert("test");

                            if(response.success == true) {
                                $scope.userData = {};
                                $localStorage.currentUser = response.user;
                                $timeout(function(){
                                    $state.go('app.lists');
                                    $window.location.reload(true);
                                    console.log($localStorage.currentUser);
                                }, 200);

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

    /**************************************** DEBUT AccountCtrl ****************************************/

    .controller('AccountCtrl', function($scope, $http, $state, $ionicPopup, $localStorage, $ionicHistory) {
        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        $scope.updateUser = function() {
            if ($scope.userData.user_password
                && $scope.userData.user_password_confirmation) {

                if ($scope.userData.user_password == $scope.userData.user_password_confirmation) {
                    $scope.error = "";

                    $http.post($scope.apiLink+"User/UserController.php",
                        {
                            type : 'user',
                            action : 'update',
                            user: {
                                user_password : $scope.userData.user_password,
                                user_id : $localStorage.currentUser.user_id
                            }
                        })

                        .then(function (res){
                                var response = res.data;
                                $ionicPopup.alert({
                                    title: "Votre mot de passe a bien été modifié",
                                    buttons: [
                                        {
                                            text: 'Ok',
                                            type: 'button-positive',
                                            onTap: function () {
                                                $state.go($state.current, {}, {reload: true});
                                                $scope.userData = {};
                                            }
                                        }
                                    ]
                                });
                            },
                            function(error){
                                console.log('ERROR UPDATE USER');
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
        }

        $scope.deleteUser = function () {
            $ionicPopup.confirm({
                title: 'Êtes vous sur de supprimer votre compte ?',
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
                            $http.post($scope.apiLink+"User/UserController.php", {
                                    type : 'user',
                                    action : 'delete',
                                    user: {
                                        user_id : $localStorage.currentUser.user_id,
                                        user_name : $localStorage.currentUser.user_name
                                    }
                                })

                                .then(function (res){
                                        var response = res.data;
                                        $scope.logout();
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
        }
    })

    /**************************************** FIN AccountCtrl ****************************************/

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
    .controller('ListsCtrl', function ($scope, $http, $state, $window, $ionicPopup, $localStorage, $ionicHistory) {

        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        if ($scope.logged == true) {
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

        $scope.showNewList = function() {
            $ionicPopup.show({
                template:
                '<input type="text" placeholder="Nom de la liste" ng-model="listData.list_name">' +
                '<br>' +
                '<textarea placeholder="Description de la liste" ng-model="listData.list_description"></textarea>',
                title: 'Créer une liste',
                scope: $scope,
                buttons: [
                    { text: 'Annuler' },
                    {
                        text: '<b>Ajouter</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if ($scope.listData.list_name && $scope.listData.list_description) {
                                $http.post($scope.apiLink+"List/ListController.php", {
                                        type : 'list',
                                        action : 'add',
                                        list: {
                                            list_name: $scope.listData.list_name,
                                            list_description: $scope.listData.list_description
                                        },
                                        user: {
                                            user_id : $localStorage.currentUser.user_id,
                                            user_name : $localStorage.currentUser.user_name
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
                            else {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
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
                template:
                '<input type="text" placeholder="Nom de la liste" ng-model="list.list_name">' +
                '<br>' +
                '<textarea placeholder="Description de la liste" ng-model="list.list_description"></textarea>',
                title: 'Modifier les informations de la liste',
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
                            if (!$scope.list.list_name && !$scope.list.list_description) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $http.post($scope.apiLink+"List/ListController.php",
                                    {
                                        type : 'list',
                                        action : 'update',
                                        list: {
                                            list_id : listId,
                                            list_name: $scope.list.list_name,
                                            list_description: $scope.list.list_description
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
    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $ionicPopup, $localStorage, $window, $ionicHistory) {
        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        $http.post($scope.apiLink+"List/ListController.php", {
                type : 'list',
                action : 'find',
                list: {
                    list_id : $stateParams['listId']
                }
            })

            .then(function (res){
                    var response = res.data;

                    $scope.list = response['list'];

                    $scope.products = response['products'];
                    if (Object.keys($scope.products).length == 0) {
                        $scope.listEmpty = true;
                    }
                    else {
                        $scope.listEmpty = false;
                    }

                    $scope.users = response['users'];
                    console.log($scope.users);
                    if (Object.keys($scope.users).length == 1) {
                        $scope.usersEmpty = true;
                    }
                    else {
                        $scope.usersEmpty = false;
                    }
                },
                function(error){
                    console.warn('ERROR FIND LIST');
                    console.log(error);
                }
            );

        console.log($scope.list);



        $scope.showInfos = function(productId) {
            angular.forEach($scope.products, function(product)
            {
                if(product.product_id == productId)
                    $scope.product = product;
            });
            if ($scope.product.product_status == "Achete") {
                $scope.info = ", et <b>acheté</b> par <b>" + $scope.product.by_user_name + "</b>";
            }
            else if ($scope.product.product_status == 'Pris en charge') {
                $scope.info = ", et <b>pris en charge</b> par <b>" + $scope.product.by_user_name + "</b>";
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
                template: '<input type="text" placeholder="Pseudo de la personne" ng-model="userData.user_name">',
                title: 'Ajouter une personne',
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
                                                $scope.message = $scope.userData.user_name + " fait déjà parti de cette liste";
                                            }
                                            else if (response.inconnu == true) {
                                                $scope.message = $scope.userData.user_name + " ne correspond à aucun utilisateur";
                                            }
                                            else {
                                                $scope.message = $scope.userData.user_name + " a été ajouté à cette liste avec succès !"
                                            }
                                            $scope.userData.user_name = "";
                                            console.log(response);
                                            $ionicPopup.alert({
                                                title: $scope.message,
                                                buttons: [
                                                    {
                                                        text: '<b>Ok</b>',
                                                        type: 'button-positive',
                                                        onTap: function() {
                                                            $state.go($state.current, {}, {reload: true});
                                                        }
                                                    }
                                                ]


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

        $scope.deleteUserFromList = function(userId, userName, listId) {
            $ionicPopup.confirm({
                title: 'Êtes vous sur de supprimer ' + userName + ' de cette liste ?',
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
                            $http.post($scope.apiLink+"User/UserController.php", {
                                    type : 'user',
                                    action : 'deleteUserFromList',
                                    user : {
                                        user_id : userId,
                                        user_name : userName
                                    },
                                    list : {
                                        list_id : listId
                                    }

                                })

                                .then(function (res){
                                        var response = res.data;
                                        $state.go($state.current, {}, {reload: true});
                                        //$window.location.reload(true);
                                        console.log(response);


                                    }, function(error){
                                        console.warn('ERROR DELETE USER');
                                        console.log(error);
                                    }
                                );
                        }
                    }
                ]
            });
        };

        $scope.quitList = function(listId) {
            $ionicPopup.confirm({
                title: 'Êtes vous sur de quitter cette liste ?',
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
                            $http.post($scope.apiLink+"User/UserController.php", {
                                    type : 'user',
                                    action : 'deleteUserFromList',
                                    user : {
                                        user_id : $localStorage.currentUser.user_id,
                                        user_name : $localStorage.currentUser.user_name
                                    },
                                    list : {
                                        list_id : listId
                                    }
                                })

                                .then(function (res){
                                        var response = res.data;
                                        $state.go('app.lists');
                                        $window.location.reload(true);
                                        console.log(response);


                                    }, function(error){
                                        console.warn('ERROR DELETE USER');
                                        console.log(error);
                                    }
                                );
                        }
                    }
                ]
            });
        };

        //  Récupère toutes les listes de l'utilisateur
        $scope.showNewProduct = function(listId) {
            $ionicPopup.show({
                template: '<input type="text" placeholder="Nom du produit" ng-model="productData.product_name">',
                title: 'Ajouter un produit',
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
        console.log($scope.list);
    });
/**************************************** FIN ListCtrl ****************************************/