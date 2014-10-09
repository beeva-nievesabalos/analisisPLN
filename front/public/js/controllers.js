'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {
    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('DemoCtrl', function ($scope, $http, $timeout, $window) {

    // write Ctrl here
    $scope.clearText = function() {
      $timeout(function () {
        $scope.$apply(function () {
          $scope.inputText = '';
        });
      },10);
    }

    $scope.clearPdf = function() {
      $timeout(function () {
        $scope.$apply(function () {
          $scope.pdfFile = '';
          $scope.inputFile = null;
        });
      },10);
    }

    $scope.showPdf = function(){
      console.log($scope.pdfFile);
    }

    $scope.verDocumento = function() {
      $window.open($scope.pdfFile, 'Uploaded doc');
    }

    $scope.uploadFile = function(files) {
      console.log('uploadFile');
        var fd = new FormData();
        fd.append("file", files[0]);

        console.log(files[0]);

        $scope.file = fd;
    };

    $scope.sendFile = function(){
      if ($scope.file){
        $http.post('http://localhost:8080/api/extraerTexto', $scope.file, {
            withCredentials: true,
            headers: {'Content-Type': 'application/pdf', 'Accept':'application/pdf', "Content-Encoding":"ASCII"},
            transformRequest: angular.identity
        }).success( function(data, status, headers, config) {
            console.log('...all right!...'+data)
        }).error( function(err) {
            console.log('...damm it!...'+err)
        });
      }
    };

    $scope.sendData = function() {
      var data = '', url = '';
      console.log('senddata');
      if ($scope.inputText){
        data = {text : $scope.inputText};
        url = 'http://localhost:8080/api/extraerSemantica';

        $scope.words = $scope.formatWordsArray('');
        $scope.setListEntities('');
        console.log(data);

        if (data != ''){
          $http({
            method: 'POST',
            url: url,
            data: data,
            headers: {'Access-Control-Allow-Headers': 'Content-Type, Content-Length, X-Requested-With'}
          })
          .success(function(data, status, headers, config) {
            $scope.error = false;
            $scope.success = true;
            console.log('ok  '+JSON.stringify(data));
            if (data.cloud)
              $scope.words = $scope.formatWordsArray(data.cloud);
            $scope.setListEntities(data);
          })
          .error(function(data, status, headers, config) {
            $scope.success = false;
            $scope.error = true;
            console.log('error  '+JSON.stringify(data));
          });
        }
      }else if ($scope.file){
        $scope.sendFile();
      }else {
        $scope.error = true;
      }
    };


    $scope.formatWordsArray = function(data) {
      console.log('formatWordsArray');
      var simulatedData = {person:[],geographicalLocation:['canberra'],organization:['gobierno_de_el_reino_de_españa','gobierno_de_australia','gobierno_de_el_australia'],othersEntities:['boletín_oficial_de_el_estado_núm.','sec._i._pág.','disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación','corrección','acuerdo','boletín_oficial_de_el_estado','por_españa','por_el_reino_de_españa'],concepts:['error','aplicación','programa','movilidad','joven','publicación','número','fecha','se','efectuar','rectificación','pág.','línea','preámbulo','decir','cláusula','cupo','antefirma'],cloud:{'boletín_oficial_de_el_estado_núm.':1,'sec._i._pág.':1,'disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación':1,'corrección':1,error:2,'aplicación':2,acuerdo:2,'gobierno_de_el_reino_de_españa':2,gobierno_de_australia:3,programa:2,movilidad:2,joven:2,canberra:2,'publicación':1,'boletín_oficial_de_el_estado':1,'número':1,fecha:1,se:1,efectuar:1,'rectificación':1,'pág.':3,'línea':2,'preámbulo':1,gobierno_de_el_australia:1,decir:3,'cláusula':1,cupo:2,antefirma:1,'por_españa':1,'por_el_reino_de_españa':1}};
      var words = [], size;
      var max = 1, min = 10000000;

      angular.forEach(data/*data*/, function(value, key){
        if(value > max) max = value;
        if(value < min) min = value;
      });

      console.log('[formatWordsArray] MAX='+max+" MIN="+min);
      angular.forEach(data/*data*/, function(value, key){
        size = (50 * value / max) + 12;
        //size = (value*5)+10;
        //size = (size > 25) ? 25 : size;
        //console.log('[formatWordsArray] '+key+" ="+value);
        words.push({word: key, size:size+'px'});
      });
      $timeout(function () {
        $scope.$apply(function () {
          $scope.words = words;
        });
      },10);
    }

    $scope.setListEntities = function(data) {
      console.log('setListEntities');
      var simulatedData = {person:[],geographicalLocation:['canberra'],organization:['gobierno_de_el_reino_de_españa','gobierno_de_australia','gobierno_de_el_australia'],othersEntities:['boletín_oficial_de_el_estado_núm.','sec._i._pág.','disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación','corrección','acuerdo','boletín_oficial_de_el_estado','por_españa','por_el_reino_de_españa'],concepts:['error','aplicación','programa','movilidad','joven','publicación','número','fecha','se','efectuar','rectificación','pág.','línea','preámbulo','decir','cláusula','cupo','antefirma'],cloud:{'boletín_oficial_de_el_estado_núm.':1,'sec._i._pág.':1,'disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación':1,'corrección':1,error:2,'aplicación':2,acuerdo:2,'gobierno_de_el_reino_de_españa':2,gobierno_de_australia:3,programa:2,movilidad:2,joven:2,canberra:2,'publicación':1,'boletín_oficial_de_el_estado':1,'número':1,fecha:1,se:1,efectuar:1,'rectificación':1,'pág.':3,'línea':2,'preámbulo':1,gobierno_de_el_australia:1,decir:3,'cláusula':1,cupo:2,antefirma:1,'por_españa':1,'por_el_reino_de_españa':1}};
      var persons = [],
        geographicalLocation = [],
        organization = [],
        othersEntities = [],
        concepts = [];

      if (/*simulatedData.person*/data.person){
        angular.forEach(data.person/*data.person*/, function(value, key){
          persons.push(value);
        });
      }
      if (data.geographicalLocation/*data.geographicalLocation*/){
        angular.forEach(data.geographicalLocation/*data.geographicalLocation*/, function(value, key){
          geographicalLocation.push(value);
        });
      }
      if (data.organization/*data.person*/){
        angular.forEach(data.organization/*data.organization*/, function(value, key){
          organization.push(value);
        });
      }
      if (data.othersEntities/*data.othersEntities*/){
        angular.forEach(data.othersEntities/*data.othersEntities*/, function(value, key){
          othersEntities.push(value);
        });
      }
      if (data.concepts/*data.person*/){
        angular.forEach(data.concepts/*data.person*/, function(value, key){
          concepts.push(value);
        });
      }

      $timeout(function () {
        $scope.$apply(function () {
          $scope.persons = persons;
          $scope.geographicalLocation = geographicalLocation;
          $scope.organization = organization;
          $scope.othersEntities = othersEntities;
          $scope.concepts = concepts;
        });
        console.log($scope);
      },10);
    }

    $scope.clickMe1 = function(word) {
      return $scope.word1 = word;
    };
    $scope.sort1 = 'no';
  });