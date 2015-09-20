(function () {
	'use strict';

	var angular = require('angular');

	require('angular-socket-io');

	angular.module('team', [
		'btford.socket-io'
	])
	.factory('mySocket', function ( socketFactory ) {
		return socketFactory();
	})
	.controller('TeamController', function ( $scope, mySocket ) {
		$scope.name = 'NEW TEAM';
		$scope.game = { title: 'Trivia' };
		$scope.teams = [];
		$scope.round = { points: 0 };
		$scope.showEdit = false;
		$scope.showLeaderboard = false;

		/* Handle teamID */
		function generateTeamID() {
			return Math.random().toString(36).substring(3,16) + (1 * new Date());
		}
		var teamID = localStorage.getItem('teamID') || generateTeamID();
		localStorage.setItem('teamID', teamID);

		/* Emit a register event to try to reestablish prior meta */
		mySocket.emit('register-team', teamID);

		// mySocket.emit('new-team');

		$scope.buzz = function () {
			console.log('BUZZ');
			mySocket.emit('buzz');
		};

		$scope.save = function () {
			console.log('Save Changes');
			mySocket.emit('update-team', {
				name: $scope.name,
				color: $scope.color
			});
			$scope.showEdit = false;
		};

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

		mySocket.on('welcome', function (data) {
			console.log('Welcome:', data);
			$scope.name = data.name;
			$scope.score = data.score;
			$scope.color = data.color;
		});

		mySocket.on('buzz', function (data) {
			console.log('Buzz:', data);
			/* Disabled the buzz button when a buzz event is received */
			$scope.buzzDisabled = true;
			$scope.showAnswering = true;
			$scope.currentBuzzer = data;
		});

		mySocket.on('correct', function ( data ) {
			console.log('correct', data);
			/* Enable the buzz button */
			// $scope.buzzDisabled = false;
			$scope.showAnswering = false;
			$scope.currentBuzzer = null;
		});
		mySocket.on('wrong', function ( data ) {
			console.log('Wrong:', data);
			/* Enable the buzz button */
			// $scope.buzzDisabled = false;
			$scope.showAnswering = false;
			$scope.currentBuzzer = null;
		});

		mySocket.on('show-buzzer', function () {
			$scope.showBuzzer = true;
		});
		mySocket.on('hide-buzzer', function () {
			$scope.showBuzzer = false;
		});
	});

})();
