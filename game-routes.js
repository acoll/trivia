var _ = require('underscore');

module.exports = function (io) {

	var waitText = 'Please wait while the next question is being assembled.';

	var teamCount = 1;

	var teams = {};
	var scoreboards = {};
	var hosts = {};
	var rounds = [];

	rounds.push({ question: waitText, points: 0, roundNum: rounds.length + 1 });

	function getTeams() {
		return _.sortBy(_.values(teams), function (team) {
			return team.score;
		});
	}

	io.on('connection', function (socket) {
		console.log(socket.id, 'connected');
		socket.emit('teams', getTeams());
		socket.emit('round', rounds[rounds.length - 1]);


		socket.on('disconnect', function () {
			console.log(socket.id, 'disconnected');

			delete teams[socket.id];
			delete scoreboards[socket.id];
			delete hosts[socket.id];

			io.emit('teams', getTeams());
		});

		socket.on('new-team', function (data) {
			console.log('New Team', socket.id, data);

			teams[socket.id] = {
				color: 'color-' + ((teamCount % 24) + 1),
				name: 'TEAM ' +  teamCount++,
				score: 0,
				id: socket.id
			};
			io.emit('teams', getTeams());
			socket.emit('welcome', teams[socket.id]);
		});

		socket.on('update-team', function (data) {
			console.log('Update Team:', data);
			teams[socket.id].name = data.name;
			teams[socket.id].color = data.color;
			io.emit('teams', getTeams());
		});

		socket.on('buzz', function (data) {
			console.log('Buzz:', teams[socket.id].name);
			io.emit('buzz', teams[socket.id]);
			rounds[rounds.length - 1].buzzes.push(socket.id);
		});

		socket.on('correct', function (data) {
			console.log('Correct:', rounds[rounds.length - 1].buzzes[0]);
			var id = rounds[rounds.length - 1].buzzes[0];
			if(id && teams[id]) teams[id].score += rounds[rounds.length - 1].points;
			io.emit('teams', getTeams());
		});

		socket.on('wrong', function (data) {
			console.log('wrong:', rounds[rounds.length - 1].buzzes[0]);
			rounds[rounds.length - 1].buzzes.pop();
			io.emit('teams', getTeams());
		});

		socket.on('new-round', function (data) {
			console.log('New Round', data);
			rounds.push({ question: waitText, points: 0, roundNum: rounds.length + 1 });
			io.emit('round', rounds[rounds.length - 1]);
		});

		socket.on('update-round', function (data) {
			console.log('Update Round:', data);
			rounds[rounds.length - 1].question = data.question;
			rounds[rounds.length - 1].points = data.points;
			rounds[rounds.length - 1].buzzes = [];
			io.emit('round', rounds[rounds.length - 1]);
		});

		

	});
};