(function () {

	console.log('TEAM');
	var app = angular.module('team', []);

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

	app.controller('TeamController', function ($scope, socket) {
		$scope.name = 'NEW TEAM';
		$scope.teams = [];
		$scope.round = { points: 0 };
		$scope.showEdit = false;
		$scope.showLeaderboard = false;

		$scope.buzz = function () {
			console.log('BUZZ');
			socket.emit('buzz');
		};

		$scope.save = function () {
			console.log('Save Changes');
			socket.emit('update-team', {
				name: $scope.name,
				color: $scope.color
			});
			$scope.showEdit = false;
		};

		socket.on('teams', function (data) {
			console.log('Teams:', data);
			$scope.teams = data;
		});

		socket.on('round', function (data) {
			console.log('Round:', data);
			$scope.round = data;
		});

		socket.on('welcome', function (data) {
			console.log('Welcome:', data);
			$scope.name = data.name;
			$scope.score = data.score;
			$scope.color = data.color;
		});

		socket.on('buzz', function (data) {
			console.log('Buzz:', data);
		});

		socket.emit('new-team');
	});

})();