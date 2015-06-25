(function () {

	var app = angular.module('scoreboard', []);	

	app.factory('socket', function ($rootScope) {

		var socket = io.connect();
		console.log('New Socket Connection');

		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {  
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				})
			}
		};
	});

	app.controller('ScoreboardController', function ($scope, socket) {
		$scope.teams = [];
		$scope.title = 'Trivia';
		$scope.currentBuzzer = null;

		socket.on('teams', function (data) {
			console.log('Teams:', data);
			$scope.teams = data;
		});

		socket.on('round', function (data) {
			console.log('Round:', data);
			$scope.round = data;
		});

		socket.on('buzz', function (data) {
			console.log('Buzz', data);
			$scope.currentBuzzer = data.name;
			setTimeout(function () {
				$scope.$apply(function () {
					$scope.currentBuzzer = null;
				});
			}, 3000);
		});
	});
})();
