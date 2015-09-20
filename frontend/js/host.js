(function () {
	'use strict';

	var angular = require('angular');

	require('angular-socket-io');

	angular.module('host', [
		'btford.socket-io'
	])
	.factory('mySocket', function ( socketFactory ) {
		return socketFactory();
	})
	.controller('HostController', function ($scope, mySocket) {
		console.log('HOST SOCKET', mySocket);

		$scope.title = 'Trivia';
		$scope.teams = [];
		$scope.round = { points: 100 };
		$scope.currentBuzzer = null;

		$scope.updateRound = function () {
			console.log('Update Round', $scope.round);
			mySocket.emit('update-round', $scope.round);
		};

		$scope.wrongClick = function () {
			console.log('Wrong Click');
			mySocket.emit('wrong', $scope.currentBuzzer);
			$scope.currentBuzzer = null;
		};

		$scope.correctClick = function () {
			console.log('Correct Click');
			mySocket.emit('correct', $scope.currentBuzzer);
			$scope.currentBuzzer = null;
		};

		$scope.decRoundNum = function decRoundNum() {
			if ($scope.round.roundNum > 1) {
				$scope.round.roundNum--;
			}
		};
		$scope.incRoundNum = function incRoundNum() {
			$scope.round.roundNum++;
		};
		$scope.decQuestionNum = function decQuestionNum() {
			if ($scope.round.questionNum > 1) {
				$scope.round.questionNum--;
			}
		};
		$scope.incQuestionNum = function incQuestionNum() {
			$scope.round.questionNum++;
		};

		$scope.save = function save() {

		};

		mySocket.on('teams', function (data) {
			console.log('Teams:', data);
			$scope.teams = data;
		});

		mySocket.on('round', function (data) {
			console.log('Round:', data);
			$scope.round = data;
		});

		mySocket.on('buzz', function (data) {
			console.log('Buzz:', data);
			$scope.currentBuzzer = data;
		});
	});

})();
