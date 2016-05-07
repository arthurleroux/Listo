angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope) {
        $scope.lists = [
            {title: 'Ziland', id: 1},
            {title: 'Ziland LDC', id: 2},
            {title: 'Chill', id: 3}
        ];

    })

    .controller('ListsCtrl', function ($scope, $stateParams) {
        console.log($stateParams);
    })

    .controller('ListCtrl', function ($scope, $stateParams) {
        angular.forEach($scope.lists, function(list)
        {
            if(list.id == $stateParams['listId'])
                $scope.list = list;
        });

        $scope.products =  [
            {name: 'JackDa'},
            {name: 'Weed'},
            {name: 'Ricard'}
        ];
    });




