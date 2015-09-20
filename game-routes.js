var _ = require('underscore');

const DISCONNECT_TIMEOUT = 60 * 1000; // milliseconds

module.exports = function (io) {

	var waitText = 'Please wait while the next question is being assembled.';

	// var teamCount = 1;

	var teams = {};
	var __timeoutCounter = 1;
	var __timeouts = {};
	var scoreboards = {};
	var hosts = {};
	var game = {
		title: 'Trivia'
	};
	var rounds = [];

	rounds.push({ questionNum: 1, question: waitText, points: 0, roundNum: rounds.length + 1 });

	function getTeamBySocket( socketId ) {
		return _.findWhere(teams, { id: socketId });
	}

	function getTeams() {
		var _teams = _.extend({}, teams);

		return _(_.values(_teams)).chain()
			.sortBy(function ( team ) {
				return team.score;
			})
			.value();
	}

	/**
	 *	Replaces [#prop] with the matching data.prop and an empty space if undefined
	 **/
	function annotate( string, data ) {
		return string.replace(/\[#\w+\]/g, function ( token, idx, str ) {
			var token = token.substring(2, token.length-1);
			return data[token] !== undefined ? data[token] : '';
		});
	}

	io.on('connection', function (socket) {
		console.log('A new connection has been made', socket.id);

		socket.emit('game', game);
		socket.emit('teams', getTeams());
		socket.emit('round', rounds[rounds.length - 1]);

		/* Team registering */
		socket.on('register-team', function ( teamID ) {
			console.log('register-team', teamID);

			var team;

			if (teamID) {
				team = teams[ teamID ];
				if (team) {
					/* Update socket id */
					team.id = socket.id;

					/* Clear disconnect timeout */
					var timeout = __timeouts[ teamID ];
					if (timeout) {
						clearTimeout(timeout);
						delete __timeouts[ teamID ];
					}
				} else {
					/* Create new team data */
					var teamCount = _.keys(teams).length;
					team = {
						color: 'color-' + ((teamCount % 24) + 1),
						name: 'TEAM ' + (teamCount + 1),
						score: 0,
						id: socket.id
					};
					teams[ teamID ] = team;
				}
			} else {
				/* teamID is required */
				console.error('No teamID provided.');
			}

			/* Emit team updates to all */
			io.emit('teams', getTeams());

			/* Emit welcome and round info to new team */
			socket.emit('welcome', team);
			socket.emit('round', rounds[rounds.length - 1]);
		});

		socket.on('disconnect', function () {
			var team = getTeamBySocket(socket.id),
				teamID = _.findKey(teams, team);

			console.log(teamID, 'disconnected');

			if (team) {
				__timeouts[ teamID ] = setTimeout(function () {
					if (team) {
						console.log('Timeout for', team.name, '(' + teamID +') has expired. They\'re being removed...');
						delete teams[ teamID ];
						io.emit('teams', getTeams());
					}
				}, DISCONNECT_TIMEOUT);

				io.emit('teams', getTeams());
			}
		});

		socket.on('update-team', function (data) {
			var team = _.findWhere(teams, { id: socket.id });
			console.log('Update Team:', team, 'with data:', data);

			_.extend(team, _.pick(data, [ 'name', 'color' ]));

			io.emit('teams', getTeams());
		});

		socket.on('buzz', function (data) {
			io.emit('hide-buzzer');

			var team = getTeamBySocket(socket.id);
			console.log('Buzz:', team.name);
			io.emit('buzz', team);
			rounds[rounds.length - 1].buzzes.push(team);
		});

		socket.on('correct', function ( data ) {
			var team = getTeamBySocket(data.id);

			console.log(team.name, 'answered correctly');

			team.score += rounds[rounds.length - 1].points;

			io.emit('teams', getTeams());
		});

		socket.on('wrong', function ( data ) {
			var team = getTeamBySocket(data.id);

			console.log(team.name, 'answered wrongly');

			io.emit('show-buzzer');
		});

		socket.on('new-round', function (data) {
			console.log('New Round', data);
			rounds.push({ question: waitText, points: 0, roundNum: rounds.length + 1 });
			io.emit('round', rounds[rounds.length - 1]);
		});

		socket.on('update-round', function (data) {
			console.log('Update Round:', data);

			var round = rounds[ rounds.length - 1 ];

			round.roundNum  	= data.roundNum;
			round.questionNum 	= data.questionNum;
			round.question 		= annotate(data.question, round);
			round.points 		= data.points;
			round.buzzes 		= [];

			io.emit('round', round);
			io.emit('show-buzzer');
		});


		/**
		 *	GAME logic
		 **/
		socket.on('update-game', function ( data ) {
			console.log('Update Game', data);

			game.title = data.title;

			io.emit('game', game);
		});
	});
};
