const proces = require('process');
const playerCount = parseInt(process.argv[2]);
console.log(`<${process.argv[2]}> <${playerCount}>`);

const rr = require('roundrobin');
const util = require('util');

function beginSearch(players, rounds) {
	const pendingPlayers = new Set(players);
	const pendingRounds = new Set(rounds);

	const playerOrder = new Set(pendingPlayers);
	const roundOrder = new Set(pendingRounds);
	
	const fixedPlayers = new Set();
	const mobilePlayers = new Set();
	const rotationRounds = new Set();

	let nextFixed;
	let nextMobile;
	let nextRound;

	for (nextFixed of playerOrder) {
		fixedPlayers.add(nextFixed);
		pendingPlayers.delete(nextFixed)
	
		for (nextRound of roundOrder) {
			nextMobile = nextRound.get(nextFixed);

			mobilePlayers.add(nextMobile);
			pendingPlayers.delete(nextMobile);
			rotationRounds.add(nextRound);
			pendingRounds.delete(nextRound);

			if (completeRotation(pendingPlayers, fixedPlayers, mobilePlayers, pendingRounds, rotationRounds)) {
				return [rotationRounds, fixedPlayers, mobilePlayers, pendingRounds];
			}

			mobilePlayers.delete(nextMobile);
			pendingPlayers.add(nextMobile);
			rotationRounds.delete(nextRound);
			pendingRounds.add(nextRound);
		}

		fixedPlayers.delete(nextFixed);
		pendingPlayers.add(nextFixed)
	}

	return undefined;
}


function completeRotation(pendingPlayers, fixedPlayers, mobilePlayers, pendingRounds, rotationRounds) {
	let nextRound;

	const playerOrder = new Set(pendingPlayers);
	const roundOrder = new Set(pendingRounds);

	for (nextRound of roundOrder) {
		let nextFixed;
		let nextMobile;
		let mismatch = false;
		console.log("?? nextRound::", nextRound);

		for (const nextChecked of fixedPlayers) {
			const nextPaired = nextRound.get(nextChecked);
			if (fixedPlayers.has(nextPaired)) {
				console.log("!! fixedToFixed\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile, "\n\t** Mismatched Pair:", [nextChecked, nextPaired]);
				mismatch = true;
				break;
			}
		}

		if (mismatch) {
			continue;
		}

		for (const nextChecked of mobilePlayers) {
			const nextPaired = nextRound.get(nextChecked);
			if (mobilePlayers.has(nextPaired)) {
				console.log("!! mobileToMobile\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile, "\n\t** Mismatched Pair:", [nextChecked, nextPaired]);
				mismatch = true;
				break;
			}
		}

		if (mismatch) {
			continue;
		}

		for (const nextChecked of playerOrder) {
			const nextPaired = nextRound.get(nextChecked);

			if (mobilePlayers.has(nextPaired)) {
				// console.log("?? mobileCheck::", nextPaired, mobilePlayers.has(nextPaired), nextChecked, mobilePlayers.has(nextChecked), nextFixed, pendingPlayers.has(nextChecked), nextMobile);
				if (!! nextFixed) {
					console.log("!! extraFixed\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile, "\n\t** Extra Fixed:", nextChecked);
					mismatch = true;
					break;
				}
				for (const pastRound of rotationRounds) {
					const pastPaired = pastRound.get(nextChecked);
					if (fixedPlayers.has(pastPaired)) {
						console.log("!! prevFixedMismatch\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile, "\n\t** Previous Round:", pastRound, "\n\r** Previous Mismatch:", [nextChecked, pastPaired]);
						mismatch = true;
						break;
					}
				}
				if (mismatch) { break; }

				nextFixed = nextChecked;
				console.log("~~ foundFixed\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile);
			}

			if (fixedPlayers.has(nextPaired)) {
				// console.log("?? fixedCheck::", nextPaired, fixedPlayers.has(nextPaired), nextChecked, fixedPlayers.has(nextChecked), nextMobile, pendingPlayers.has(nextChecked), nextFixed);
				if (!! nextMobile) {
					console.log("!! extraMobile\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile, "\n\t** Extra Mobile:", nextChecked);
					mismatch = true;
					break;
				}
				for (const pastRound of rotationRounds) {
					const pastPaired = pastRound.get(nextChecked);
					if (mobilePlayers.has(pastPaired)) {
						console.log("!! prevMobileMismatch\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Previous Round:", pastRound, "\n\r** Previous Mismatch:", [nextChecked, pastPaired]);
						mismatch = true;
						break;
					}
				}
				if (mismatch) { break; }

				nextMobile = nextChecked;
				console.log("~~ foundMobile\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile);
			}
		}

		if( mismatch ) {
			continue;
		}

		/*if ((!nextFixed) || (!nextMobile)) {
			console.log("!! failedToMatch\n\t** Rounds:", rotationRounds, "\n\t** Next Round:", nextRound, "\n\t** Fixed:", fixedPlayers, "\n\t** Next Fixed:", nextFixed, "\n\t** Mobile:", mobilePlayers, "\n\t** Next Mobile:", nextMobile);

			continue;
		}*/

		const stepMessage = "\n\t** Rounds: " + util.inspect(rotationRounds) + "\n\t** This Round: " + util.inspect(nextRound) + "\n\t** Fixed: " + util.inspect(fixedPlayers) + "\n\t** This Fixed: " + util.inspect(nextFixed) + "\n\t** Mobile: " + util.inspect(mobilePlayers) + "\n\t** This Mobile: " + util.inspect(nextMobile);
		const shortStepMessage = "\n\t** Round: " + util.inspect(nextRound) + "\n\t** Fixed: " + util.inspect(nextFixed) + "\n\t** Mobile: " + util.inspect(nextMobile);

		fixedPlayers.add(nextFixed);
		pendingPlayers.delete(nextFixed);
		mobilePlayers.add(nextMobile);
		pendingPlayers.delete(nextMobile);
		rotationRounds.add(nextRound);
		pendingRounds.delete(nextRound);

		if (pendingPlayers.size == 0) {
			console.log("## completedSolution" + shortStepMessage);
			return true;
		}

		console.log("## attemptingToComplete" + stepMessage);
		if( completeRotation(pendingPlayers, fixedPlayers, mobilePlayers, pendingRounds, rotationRounds) ) {
			console.log("## acceptedForSolution" + shortStepMessage);
			return true;
		}

		console.log("## failedToComplete" + stepMessage);

		// Rollback the failed attempt and keep on searching...
		fixedPlayers.delete(nextFixed);
		pendingPlayers.add(nextFixed);
		mobilePlayers.delete(nextMobile);
		pendingPlayers.add(nextMobile);
		rotationRounds.delete(nextRound);
		pendingRounds.add(nextRound);
	}

	console.log("## outOfOptions\n\t** Pending Rounds:", roundOrder, "\n\t** Selected Rounds:", rotationRounds, "\n\t** Fixed:", fixedPlayers, "\n\t** Mobile:", mobilePlayers, "\n");

	return false;
}

const rounds = rr(playerCount);

const allRoundMaps = new Set();
rounds.forEach(
	(roundMatches) => {
		const roundMap = new Map();
		roundMatches.forEach(
			(pair) => {
				roundMap.set(pair[0], pair[1]);
				roundMap.set(pair[1], pair[0]);
			}
		);

		allRoundMaps.add(roundMap);
	}
);

const allPlayers = new Set();
for (let ii = 1; ii <= playerCount; ii++ ) {
	allPlayers.add(ii);
}

const solution = beginSearch(allPlayers, allRoundMaps);
if (!!solution) {
	for (let nextMobile of solution[2]) {
		for (let nextRoundMap of solution[0]) {
			nextRoundMap.delete(nextMobile);
		}
	}

	for (let nextRoundMap of solution[3]) {
		const foundFirst = new Set(allPlayers);
		for( let nextPlayer of foundFirst ) {
			const foundLast = nextRoundMap.get(nextPlayer);
			foundFirst.delete(foundLast);
			nextRoundMap.delete(foundLast);
		}
	}

	console.log("Solved!");
	console.log("Players at fixed tables:", solution[1]);
	console.log("Players in rotation:", solution[2]);
	console.log("Rounds of rotation:", solution[0]);
	console.log("Rounds after rotation:", solution[3]);
} else {
	console.error("Failed to find a solution!");
	console.error(rounds);
}



/*
		for (const checkFixed of fixedPlayers) {
			const checkMobile = nextRound.get(checkFixed);
			if (fixedPlayers.has(checkMobile)) {
				return false;
			} else if (pendingPlayers.has(checkMobile)) {
				mobilePlayers.add(checkMobile);
				pendingPlayers.delete(checkMobile);
				break;
			}
		}

		for (const checkMobile of mobilePlayers) {
			const checkFixed = nextRound.get(checkMobile);
			if (mobilePlayers.has(checkFixed)) {
				return false;
			} else if (pendingPlayers.has(checkFixed)) {
				nextFixed = checkFixed;
				break;
			}
		}

	for (nextFixed of playerOrder) {
		fixedPlayers.add(nextFixed);
		pendingPlayers.delete(nextFixed)
	
		for (nextRound of roundOrder) {
			nextMobile = nextRound.get(fixedOne)
			if (fixedPlayers.has(nextMobile)) {
				// Fail!
			}

			mobilePlayers.add(nextMobile);
			rotationRounds.add(roundOne);
			pendingRounds.delete(roundOne);
	
		}
*/	
