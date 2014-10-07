'use strict';

/* Directives */

angular.module('myApp.directives', [])
  .directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes, $timeout) {
            element.bind("change", function (changeEvent) {
                console.log('change');
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    setTimeout(function () {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                            console.log(scope.fileread);
                        });
                    },10);
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
  }])
  .directive('wordCloud', ['$interpolate', function($interpolate) {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      scope: {
        words: '=',
        sort: '@'
      },
      template:
        "<div class='word-cloud-group'>" +
          "<span class='word-cloud-group-item' ng-repeat='word in mywords | orderBy:param:reverse' ng-transclude></span>" +
        "</div>",
      controller: ['$scope', '$transclude', function($scope, $transclude) {
        // set up the click function
        $scope.initClick = function(clickFn) {
          $transclude(function(clone,scope) {
            // pull the click function from the transcluded scope
            $scope.clickFn = scope[clickFn];
          });
        };
      }],
      compile: function(elem, attr) {

        // extract the type of cloud
        var type = angular.isUndefined(attr.type) ? 'list' : attr.type;
        switch(type) {
          case 'cloud':
            elem.children().eq(0).attr('style',"font-size: "+$interpolate.startSymbol()+" fontSize(word.size) "+$interpolate.endSymbol()+";");
            break;
          case 'list':
            break;
        }

        return function(scope, elem, attr) {

          // initialize the click function to nothing
          scope.clickFn = function() {};
          if(!angular.isUndefined(attr.ngClick)) {
            // initialize the click function to whatever we've been given
            scope.initClick(attr.ngClick);
          }

          // normalize the word array
          var convertWords = function() {
            var words = angular.copy(scope.words);

            if(angular.isArray(words) && words.length > 0) {
              if(!angular.isObject(words[0])) {
                words = words.map(function(e) { return { word: e, size: 1 }});
              } else if(angular.isUndefined(words[0].word) || angular.isUndefined(words[0].size)) {
                words = [];
              }
            } else {
              words = [];
            }

            words = words.map(function(e) { return {word: e.word, size: e.size, rawSize: parseFloat(e.size) }; });

            scope.mywords = words;
          };

          scope.fontSize = function(size) {
            if((''+size).search("(px|em|in|cm|mm|ex|pt|pc|%)+") == -1) {
              return size+'em';
            }
            return size;
          };

          scope.$watch('words',function() {
            convertWords();
          },true);

          scope.$watch('sort',function(newVal) {
            if(!newVal) { newVal = 'no' }
            scope.param = newVal.substr(0,5) == 'alpha' ? 'word' : (newVal == 'no' ? '' : 'rawSize');
            scope.reverse = newVal.substr(-4).toLowerCase() == 'desc';
          });

        }
      }
    };
  }]);