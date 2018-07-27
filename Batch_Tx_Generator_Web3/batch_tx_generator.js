//create a web3 instance
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8888');  //custome

// decrypt
root_account = web3.eth.accounts.decrypt({
	"address": "67d7e35ceb75b77fe9f07629f210340c4f53fa57",
	"crypto": {
		"cipher": "aes-128-ctr",
		"ciphertext": "2be5d3e30508a443cac71a0135af7c9e18a162a53380d68546d05581a2420147",
		"cipherparams": {
			"iv": "b387d43ee2676e0ebe0a4fab4f788604"
		},
		"kdf": "scrypt",
		"kdfparams": {
			"dklen": 32,
			"n": 262144,
			"p": 1,
			"r": 8,
			"salt": "9799407d5f1fef17721f06b3044a899044dffc53d0a1d73e9ade3f0714fee233"
		},
		"mac": "0a9ce73f5c215024334d081c3b6b29ae86a040776b75dab1af6b1e8ebfabfacc"
	},
	"id": "41f86351-977b-4e1f-9674-effb09124367",
	"version": 3
},"data");     // "data" is pwd

// unlock
web3.eth.personal.unlockAccount(root_account.address, "data", 100000)

// Get balance
web3.eth.getBalance(root_account.address).then(console.log)

private_keys = fs.readFileSync(os.homedir() + "/account_keys.txt", "utf8").split('\n');

raw_accounts = private_keys.map(x => web3.eth.accounts.privateKeyToAccount(x))

total_accounts = raw_accounts.length

root_account.signTransaction({to: raw_accounts[0].address, value: web3.utils.toWei("1", "ether"),chainId:15,gas: 21000}).then(function(result) { web3.eth.sendSignedTransaction(result.rawTransaction).on('receipt', console.log);});

function tx_speed(workers) {
  nonce = web3.eth.getTransactionCount(root_account.address);
  account_idx = 0;
  function send_tx(msg) {
    var start = Date.now();
    while (account_idx < total_accounts) {
      var signed_tx = root_account.signTransaction({to: raw_accounts[account_idx++].address, value: web3.utils.toWei("1", "ether"), gas: 21000, nonce:nonce++,chainId:15});  //customize chainId
      web3.eth.sendSignedTransaction(signed_tx.rawTransaction);
    };
    var elapsed = Date.now() - start; console.log("Finished: " + msg + " elapsed: " + elapsed.toString());
  }

  for (i = 0; i < workers; ++i) {
    send_tx("worker" + i.toString());
  }
};

tx_speed(100);
