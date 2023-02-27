const fs = require('fs')

var state = {}
if (fs.existsSync('./DairState.json')) {
	state = JSON.parse(fs.readFileSync("./DairState.json"))
}

module.exports = nodecg => {
	function sendDataUpdate(ignoreId) {
		state.socketId = ignoreId
		nodecg.sendMessage('DairUpdate', state)
		delete state.socketId
	}
	nodecg.listenFor('DairStateRequest', (id) => {
		sendDataUpdate(id)
	});
	nodecg.listenFor('UpdateDairData', (value) => {
		for (key in value) {
			state[key] = value[key]
		}
		sendDataUpdate(state.socketId)
		delete state.socketId
		const jsonString = JSON.stringify(state)
		fs.writeFile('./DairState.json', jsonString, err => {
			if (err) {
				console.log('Error writing file', err)
			} else {
			}
		})
	})
};