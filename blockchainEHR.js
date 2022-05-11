const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const uuid = require('uuid/v5');

function Blockchain() {
	this.chain = [];
	this.pendingTransactions = [];

	this.currentNodeUrl = currentNodeUrl;
	this.networkNodes = [];

	this.createNewBlock(1435345300, 'dasdadsasdasd', 'asdasdasdas0');
};


Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
	const newBlock = {
		index: this.chain.length + 1,
		timestamp: Date.now(),
		transactions: this.pendingTransactions,
		nonce: nonce,
		hash: hash,
		previousBlockHash: previousBlockHash
	};

	this.pendingTransactions = [];
	this.chain.push(newBlock);

	return newBlock;
};


Blockchain.prototype.getLastBlock = function() {
return this.chain[this.chain.length - 1]; 	
};
//Blockchain.prototype.getLasttransaction = function() {
	//return this.pendingTransactions[this.pendingTransactions.length]; 	
	//};



Blockchain.prototype.createNewTransaction = function(Patient_name, Age, Weight, Blood_pressure, Diet_chart, Diagnosis, Treatment, Medication, Lab_test_radiology_results, Vaccinations, Allergies, Sender, EHR_ID) {
	//const EHR_ID = uuid().split('-').join('');
	const newTransaction = {
		Patient_name: Patient_name,
		Age: Age,
		Weight: Weight,
		Blood_pressure: Blood_pressure,
		Diet_chart: Diet_chart,
		Diagnosis: Diagnosis,
		Treatment: Treatment,
		Medication: Medication,
		Lab_test_radiology_results: Lab_test_radiology_results,
		Vaccinations: Vaccinations,
		Allergies: Allergies,
		Sender:Sender, 
	    EHR_ID:EHR_ID
	};
 
	return newTransaction;
};
//Blockchain.prototype.idtransaction = function(amount, sender, recipient) {
	//const idAsString =amount.toString() + sender + recipent;
	//const EHR_ID = sha256(idAsString);
	//return EHR_ID;
//};

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
	const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
	const hash = sha256(dataAsString);
	return hash;
};


//const EHR_ID = this.idtransaction(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
	let nonce = 0;
	let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	while (hash.substring(0, 5) !== '00000') {
		nonce++;
		hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
	}

	return nonce;
};



Blockchain.prototype.chainIsValid = function(blockchain) {
	let validChain = true;
	
	for (var i = 1; i < blockchain.length; i++) {
		const currentBlock = blockchain[i];
		const prevBlock = blockchain[i - 1];
		const blockHash = this.hashBlock(prevBlock['hash'], { transactions: currentBlock['transactions'], index: currentBlock['index'] }, currentBlock['nonce']);
		if (blockHash.substring(0, 4) !== '0000') validChain = false;
		if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;
	};

	const genesisBlock = blockchain[0];
	const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

	if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;

	return validChain;
};


Blockchain.prototype.getBlock = function(blockHash) {
	let correctBlock = null;
	this.chain.forEach(block => {
		if (block.hash === blockHash) correctBlock = block;
	});
	return correctBlock;
};

Blockchain.prototype.getTransaction = function(EHR_ID) {
	let correctTransaction = null;
	let correctBlock = null;

	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if (transaction.EHR_ID === EHR_ID) {
				correctTransaction = transaction;
				correctBlock = block;
			};
		});
	});

	return {
		transaction: correctTransaction,
		block: correctBlock
	};
};



Blockchain.prototype.getAddressData = function(address) {
	const addressTransactions = [];
	this.chain.forEach(block => {
		block.transactions.forEach(transaction => {
			if(transaction.sender === address || transaction.recipient === address) {
				addressTransactions.push(transaction);
			};
		});
	});

	let balance = 0;
	addressTransactions.forEach(transaction => {
		if (transaction.recipient === address) balance += transaction.amount;
		else if (transaction.sender === address) balance -= transaction.amount;
	});

	return {
		addressTransactions: addressTransactions,
		addressBalance: balance
	};
};






module.exports = Blockchain;














