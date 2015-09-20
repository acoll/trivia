(function () {
	'use strict';

	var angular = require('angular');

	require('angular-socket-io');

	angular.module('scoreboard', [
		'btford.socket-io'
	])
	.factory('mySocket', ( socketFactory ) => {
		return socketFactory();
	})
	.controller('ScoreboardCtrl', ( $scope, mySocket ) => {
		$scope.teams = [];
		$scope.game = { title: 'Trivia' };
		$scope.currentBuzzer = null;

		mySocket.on('game', function ( data ) {
			console.log('Game:', data);
			$scope.game = data;
		});

		mySocket.on('teams', function (data) {
			console.log('Teams:', data);
			$scope.teams = data;
		});

		mySocket.on('round', function (data) {
			console.log('Round:', data);
			$scope.round = data;
		});

		mySocket.on('buzz', function (data) {
			console.log('Buzz', data);
			$scope.currentBuzzer = data.name;
		});
	});
})();
