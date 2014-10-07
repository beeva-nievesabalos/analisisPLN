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

    $scope.sendData = function() {
      var data = '', url = '';
      if ($scope.inputText){
        data = {text : $scope.inputText};
        url = 'http://localhost:8080/api/extraerSemantica';
      }else if ($scope.pdfFile){
        data = {pdf : $scope.pdfFile};
        url = 'http://localhost:8080/api/extraerTexto';
      }else {
        $scope.error = true;
      }
      
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
    }

    $scope.formatWordsArray = function(data) {
      console.log('formatWordsArray');
      var simulatedData = {person:[],geographicalLocation:['canberra'],organization:['gobierno_de_el_reino_de_españa','gobierno_de_australia','gobierno_de_el_australia'],othersEntities:['boletín_oficial_de_el_estado_núm.','sec._i._pág.','disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación','corrección','acuerdo','boletín_oficial_de_el_estado','por_españa','por_el_reino_de_españa'],concepts:['error','aplicación','programa','movilidad','joven','publicación','número','fecha','se','efectuar','rectificación','pág.','línea','preámbulo','decir','cláusula','cupo','antefirma'],cloud:{'boletín_oficial_de_el_estado_núm.':1,'sec._i._pág.':1,'disposiciones_generales_ministerio_de_asuntos_exteriores_y_de_cooperación':1,'corrección':1,error:2,'aplicación':2,acuerdo:2,'gobierno_de_el_reino_de_españa':2,gobierno_de_australia:3,programa:2,movilidad:2,joven:2,canberra:2,'publicación':1,'boletín_oficial_de_el_estado':1,'número':1,fecha:1,se:1,efectuar:1,'rectificación':1,'pág.':3,'línea':2,'preámbulo':1,gobierno_de_el_australia:1,decir:3,'cláusula':1,cupo:2,antefirma:1,'por_españa':1,'por_el_reino_de_españa':1}};
      var words = [];
      angular.forEach(simulatedData.cloud/*data*/, function(value, key){
        words.push({word: key, size:((value*5)+10)+'px'});
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

      if (simulatedData.person/*data.person*/){
        angular.forEach(simulatedData.person/*data.person*/, function(value, key){
          persons.push(value);
        });
      }
      if (simulatedData.geographicalLocation/*data.geographicalLocation*/){
        angular.forEach(simulatedData.geographicalLocation/*data.geographicalLocation*/, function(value, key){
          geographicalLocation.push(value);
        });
      }
      if (simulatedData.organization/*data.person*/){
        angular.forEach(simulatedData.organization/*data.organization*/, function(value, key){
          organization.push(value);
        });
      }
      if (simulatedData.othersEntities/*data.othersEntities*/){
        angular.forEach(simulatedData.othersEntities/*data.othersEntities*/, function(value, key){
          othersEntities.push(value);
        });
      }
      if (simulatedData.concepts/*data.person*/){
        angular.forEach(simulatedData.concepts/*data.person*/, function(value, key){
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