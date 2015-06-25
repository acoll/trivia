(function () {

	console.log('HOST');

	var app = angular.module('host', []);

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

	app.controller('HostController', function ($scope, socket) {
		$scope.title = 'Trivia';
		$scope.teams = [];
		$scope.round = { points: 100 };
		$scope.currentBuzzer = null;

		$scope.updateRound = function () {
			console.log('Update Round', $scope.round);
			socket.emit('update-round', $scope.round);
		};

		$scope.wrongClick = function () {
			console.log('Wrong Click');
			socket.emit('wrong');
		};

		$scope.correctClick = function () {
			console.log('Correct Click');
			socket.emit('correct');
		};

		socket.on('teams', function (data) {
			console.log('Teams:', data);
			$scope.teams = data;
		});

		socket.on('round', function (data) {
			console.log('Round:', data);
			$scope.round = data;
		});

		socket.on('buzz', function (data) {
			console.log('Buzz:', data);
			$scope.currentBuzzer = data.name;
		});
	});

})();