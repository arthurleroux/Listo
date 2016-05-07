angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
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

    .controller('ListsCtrl', function ($scope, $stateParams) {

    })

    .controller('NewListCtrl', function ($scope) {

    })

    .controller('ListCtrl', function ($scope, $stateParams) {
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

/*$http.post(apiLink+"register.php",
    {lastname : $scope.postData.lastname,
        firstname: $scope.postData.firstname,
        birthdate: $scope.postData.birthdate,
        tel: $scope.postData.tel,
        address: $scope.postData.address,
        address2: $scope.postData.address2,
        address_compl: $scope.postData.address_compl,
        zip_code: $scope.postData.zip_code,
        city: $scope.postData.city,
        login: $scope.postData.login,
        password: $scope.postData.password,
        payment_owner: $scope.postData.payment_owner,
        payment_iban: $scope.postData.payment_iban,
        payment_bic: $scope.postData.payment_bic,
        pref_max_order: $scope.postData.pref_max_order,
        pref_min_income: $scope.postData.pref_min_income,
        pref_max_km: $scope.postData.pref_max_km,
        account_type: "deliver"})

    .then(function (res){
        var response = res.data;

        if ('error' in response){

            $scope.errorForm = response.error;
        }
        else if ('success' in response){

            form.$setPristine();

            $scope.errorForm = "";

            var timeout = 2000;
            $ionicLoading.show({ template: 'Compte créé avec succès, vous allez être redirigé vers la connexion', noBackdrop: true, duration: timeout });

            $timeout(function() {
                $ionicLoading.hide();
                $state.go('deliver_home');
            }, timeout);
        }

    }, function(error){
        var alertPopup = $ionicPopup.alert({
            title: "Erreur de connexion",
            template: "<p>Il semble que vous n'êtes pas connecté à internet. Veuillez vous connecter pour utiliser l'application.</p>",
            buttons: [
                { text: 'Réessayer', type: 'button-positive' }
            ]
        });
    });*/




