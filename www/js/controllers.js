angular.module('starter.controllers', ['ngStorage'])

    /**************************************** DEBUT AppCtrl ****************************************/
    .controller('AppCtrl', function ($scope, $state, $http, $localStorage, $window, $timeout, $ionicHistory) {

        $scope.apiLink = 'http://arthurleroux.fr/API/';

        $scope.listData = {};
        $scope.productData = {};
        $scope.userData = {};

        // Nécessaire pour modifier le nom d'une liste
        // Le nom de la variable doit correspondre avec le nom de la ligne list_name en bdd
        $scope.list = {};
        $scope.lists = {};
        $scope.loaderAuth = false;

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
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $localStorage.$reset();
            $state.go('app.login');
            $scope.loaderAuth = true;
            $timeout(function(){
                $window.location.reload(true);
                $scope.loaderAuth = false;
            }, 1500);
        };
    })
    /**************************************** FIN AppCtrl ****************************************/

    /**************************************** DEBUT LoginCtrl ****************************************/
    .controller('LoginCtrl', function ($scope, $state, $http, $ionicHistory, $localStorage, $window, $timeout, $ionicPopup, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
            }
        });

        if (angular.isDefined($localStorage.currentUser)) {
            $state.go('app.lists');
            //$window.location.reload(true);
        }

        $ionicHistory.nextViewOptions({
            disableBack: true
        });

        $scope.showRegister = function() {
            $state.go("app.register");
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
                                $scope.userData = {};
                                $localStorage.currentUser = response.user;
                                $state.go('app.lists');
                                $timeout(function(){
                                    $window.location.reload(true);
                                }, 600);
                            }
                            else {
                                $ionicPopup.alert({
                                    title: "Oupss",
                                    template: "Identifiants incorrects",
                                    buttons: [
                                        {
                                            text: 'Ok',
                                            type: 'button-assertive'
                                        }
                                    ]
                                });
                                $scope.userData.user_password = "";
                            }
                        },
                        function(error){
                            console.warn('ERROR LOGIN');
                            $scope.userData = {};
                        }
                    );
            }
            else {
                $ionicPopup.alert({
                    title: "Oupss",
                    template: "Tous les champs n'ont pas été remplis",
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        }
    })
    /**************************************** FIN LoginCtrl ****************************************/

    /**************************************** DEBUT AccountCtrl ****************************************/

    .controller('AccountCtrl', function($scope, $http, $state, $ionicPopup, $localStorage, $ionicHistory, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
            }
        });

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
                    $ionicPopup.alert({
                        title: "Oupss",
                        template: "Les deux mots de passe ne correspondent pas",
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                    $scope.userData.user_password_confirmation = "";
                }
            }
            else {
                $ionicPopup.alert({
                    title: "Oupss",
                    template: "Tous les champs n'ont pas étés remplis",
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
            }
        };

        $scope.deleteUser = function () {
            $ionicPopup.confirm({
                title: '<b>' + $localStorage.currentUser.user_name + ', </b> êtes vous sur de supprimer votre compte ?',
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
                                        console.warn('ERROR DELETE USER');
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
    .controller('RegisterCtrl', function ($scope, $http, $state, $ionicHistory, $ionicPopup,  $ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
            }
        });

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
                                        title: "<b>" + $scope.userData.user_name + "</b>, votre compte a bien été créé !",
                                        buttons: [
                                            {
                                                text: 'Ok',
                                                type: 'button-positive',
                                                onTap: function () {
                                                    $state.go('app.login');
                                                }
                                            }
                                        ]
                                    });

                                }
                                else {
                                    $ionicPopup.alert({
                                        title: "Oupss",
                                        template: "Ce pseudo est déjà utilisé",
                                        buttons: [
                                            {
                                                text: 'Ok',
                                                type: 'button-assertive'
                                            }
                                        ]
                                    });
                                }

                            },
                            function(error){
                                $scope.userData = {};
                                console.log(error);
                            }
                        );
                }
                else {
                    $ionicPopup.alert({
                        title: "Oupss",
                        template: "Les deux mots de passe ne correspondent pas",
                        buttons: [
                            {
                                text: 'Ok',
                                type: 'button-assertive'
                            }
                        ]
                    });
                    $scope.userData.user_password_confirmation = "";
                }
            }
            else {
                $ionicPopup.alert({
                    title: "Oupss",
                    template: "Tous les champs n'ont pas étés remplis",
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-assertive'
                        }
                    ]
                });
                $scope.userData.user_password_confirmation = "";
            }
        };
    })
    /**************************************** FIN RegisterCtrl ****************************************/

    /**************************************** DEBUT ListsCtrl ****************************************/
    .controller('ListsCtrl', function ($scope, $http, $state, $window, $ionicPopup, $localStorage, $ionicHistory, $timeout, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(false);
            }
        });

        $scope.visible = false;

        $timeout(function(){
            $scope.visible = true
        }, 800);

        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        $scope.findLists = function() {
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
        };
        $scope.findLists();

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
                                            $scope.listData.list_description = "";
                                            $scope.listData.list_name = "";
                                            $scope.findLists();
                                            //$state.go($state.current, {}, {reload: true});
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
                            $scope.findLists();
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
                                            $scope.findLists();
                                            //$state.go($state.current, {}, {reload: true});

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

        $scope.deleteList = function(listId, listName) {
            $ionicPopup.confirm({
                title: 'Êtes vous sûr de supprimer la liste <b>' + listName + '</b> ?',
                template: "Ses utilisateurs n'y auront plus accès et tous les produits qu'elle contient seront effacés",

                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $scope.findLists();
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
                                        $scope.findLists();
                                        //$state.go($state.current, {}, {reload: true});
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

    /**************************************** DEBUT RequestListsCtrl ****************************************/
    .controller('RequestListsCtrl', function ($scope, $http, $state, $window, $ionicPopup, $localStorage, $ionicHistory, $timeout) {

        $scope.visible = false;

        $timeout(function(){
            $scope.visible = true
        }, 800);


        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        $scope.findRequests = function() {
            if ($scope.logged == true) {
                $http.post($scope.apiLink+"List/ListController.php", {
                        type : 'list',
                        action : 'findAllRequest',
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
        };

        $scope.findRequests();

        $scope.decline = function(listId, listUser, listName) {
            $ionicPopup.confirm({
                title: "Êtes vous sûr de refuser l'invitation à la liste <b>" + listName + "</b>, créée par <b>" + listUser +"</b>",
                template: "Après cette action l'invitation sera supprimée et vous ne pourrez plus l'accepter",

                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current);
                        }
                    },
                    {
                        text: 'Oui',
                        type: 'button-assertive',
                        onTap: function() {
                            $http.post($scope.apiLink+"List/ListController.php", {
                                    type : 'list',
                                    action : 'refuse',
                                    list: {
                                        list_id : listId
                                    },
                                    user: {
                                        user_id : $localStorage.currentUser.user_id
                                    }
                                })

                                .then(function (res) {
                                        $scope.findRequests();
                                        //$state.go($state.current, {}, {reload: true});
                                    },
                                    function(error){
                                        console.warn('ERROR DECLINE LIST');
                                        console.log(error);
                                    }
                                );
                        }
                    }
                ]
            });
        };

        $scope.accept = function(listId) {
            $http.post($scope.apiLink+"List/ListController.php",
                {
                    type : 'list',
                    action : 'accept',
                    list: {
                        list_id : listId
                    },
                    user: {
                        user_id : $localStorage.currentUser.user_id
                    }
                })

                .then(function (res){
                        $state.go('app.lists');

                    }, function(error){
                        console.warn('ERROR ACCEPT LIST');
                        console.log(error);
                    }
                );
        }


    })
    /**************************************** FIN RequestListsCtrl ****************************************/

    /**************************************** DEBUT ListCtrl ****************************************/
    .controller('ListCtrl', function ($scope, $stateParams, $http, $state, $ionicPopup, $localStorage, $window, $ionicHistory, $timeout) {
        $scope.visible = false;

        $timeout(function(){
            $scope.visible = true
        }, 800);

        if (!angular.isDefined($localStorage.currentUser)) {
            $state.go('app.login');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        }

        $scope.findList = function() {
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
        };

        $scope.refreshProducts = function() {
            $http.post($scope.apiLink+"List/ListController.php", {
                    type : 'list',
                    action : 'refreshProducts',
                    list: {
                        list_id : $stateParams['listId']
                    }
                })

                .then(function (res){
                        var response = res.data;

                        $scope.products = response['products'];
                        if (Object.keys($scope.products).length == 0) {
                            $scope.listEmpty = true;
                        }
                        else {
                            $scope.listEmpty = false;
                        }
                    },
                    function(error){
                        console.warn('ERROR REFRESH PRODUCTS');
                        console.log(error);
                    }
                );
        };

        $scope.refreshUsers = function() {
            $http.post($scope.apiLink+"List/ListController.php", {
                    type : 'list',
                    action : 'refreshUsers',
                    list: {
                        list_id : $stateParams['listId']
                    }
                })

                .then(function (res){
                        var response = res.data;

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
                        console.warn('ERROR REFRESH USERS');
                        console.log(error);
                    }
                );
        };

        $scope.findList();

        $scope.showInfos = function(productId) {
            angular.forEach($scope.products, function(product)
            {
                if(product.product_id == productId)
                    $scope.product = product;
            });
            if ($scope.product.product_status == "Achete") {
                $scope.info = "<li><b>Acheté</b> par <b>" + $scope.product.by_user_name + "</b></li>";
            }
            else if ($scope.product.product_status == 'Pris en charge') {
                $scope.info = "<li><b>Pris en charge</b> par <b>" + $scope.product.by_user_name + "</b></li>";
            }
            else if ($scope.product.product_status == "En attente") {
                $scope.info = "<li><b>En attente</b></li>";
            }
            $ionicPopup.alert({
                title: "Informations sur le produit <b>" + $scope.product.product_name + "</b>",
                template:
                            "<ul>" +
                                "<li>Ajouté par " + $scope.product.user_name + "</li>"+ $scope.info +
                            "</ul>"
            })
        };

        // Ajouter nouveau collaborateur à la liste
        $scope.showAddUserToList = function(listId) {
            $http.post($scope.apiLink+"User/UserController.php",
                {
                    type : 'user',
                    action : 'findAll'
                })
                .then(function (res){
                        var response = res.data;
                        $scope.allUsers = response;
                        console.log($scope.allUsers);

                    }, function(error){
                        console.warn('ERROR FIND ALL USERS');
                        console.log(error);
                    }
                );

            $ionicPopup.show({
                template:
                    '<label class = "item item-input item-select">' +
                        '<select ng-model="userData.user_name">' +
                            '<option ng-repeat="user in allUsers" value="{{user.user_name}}">{{ user.user_name }}</option>' +
                            '<option value="" disabled selected>Pseudo</option>' +
                        '</select>' +
                    '</label>',
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
                                $timeout(function(){
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
                                                    $scope.message = "Une invitation a déjà été envoyée à <b>" + $scope.userData.user_name + "</b> ou alors cet utilisateur fait déjà parti de cette liste";
                                                }
                                                else if (response.inconnu == true) {
                                                    $scope.message = "<b>" + $scope.userData.user_name + "</b> ne correspond à aucun utilisateur";
                                                }
                                                else {
                                                    $scope.message = "Une invitation a été envoyée à <b>" + $scope.userData.user_name + "</b>";
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
                                                                $state.go($state.current);
                                                            }
                                                        }
                                                    ]


                                                });
                                            }, function(error){
                                                console.warn('ERROR ADD USER TO LIST');
                                                console.log(error);
                                            }
                                        );
                                }, 200);

                            }
                        }
                    }
                ]
            });
        };

        $scope.deleteUserFromList = function(userId, userName, listId, listName) {
            $ionicPopup.confirm({
                title: 'Êtes vous sûr de supprimer <b>' + userName + '</b> de la liste <b>' + listName + "</b> ?",
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $scope.findList();
                            //$state.go($state.current, {}, {reload: true});
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
                                        $scope.refreshUsers();
                                        //$state.go($state.current, {}, {reload: true});
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

        $scope.quitList = function(listId, listName) {
            $ionicPopup.confirm({
                title: 'Êtes vous sûr de quitter la liste <b>' + listName + '</b> ?',
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            $state.go($state.current);
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
                                    $state.go('app.lists');

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
                            $state.go($state.current)
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
                                            //$state.go($state.current, {}, {reload: true});
                                            $scope.refreshProducts();
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
                        $scope.refreshProducts();
                        //$state.go($state.current, {}, {reload: true});
                        console.log(response);

                    }, function(error){
                        console.warn('ERROR UPDATE PRODUCT');
                        console.log(error);
                    }
                );
        };

        $scope.deleteProduct = function(productId, productName) {
            $ionicPopup.confirm({
                title: 'Êtes vous sûr de supprimer le produit <b>' + productName + '</b> ?',
                buttons: [
                    {
                        text: 'Non',
                        onTap: function () {
                            //$state.go($state.current, {}, {reload: true});
                            $scope.findList();
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
                                        $scope.refreshProducts();
                                        //$state.go($state.current, {}, {reload: true});
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