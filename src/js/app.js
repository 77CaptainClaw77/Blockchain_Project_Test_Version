App={
    Web3Provider: null,
    contracts: {},
    account: '0x0',
    hasVoted: false,
    web3: null,
    init: function(){
	return App.initWeb3();
    },
    initWeb3: function(){
	Web3 = require("web3")
	App.web3 = new Web3(window.ethereum);
	App.Web3Provider = window.ethereum;
	// if(typeof web3 !== 'undefined'){
	//     Current provider is legacy and no longer injected. The new method is to use window.ethereum.
	//     App.Web3Provider=web3.currentProvider;
	//     web3 = new Web3(web3.currentProvider);
	    
	// }
	// else {
	//     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	//     web3 = new Web3(App.web3Provider);
	// }
	return App.initContract();
    },
    initContract: function(){
	$.getJSON("Election.json",function(election){
	    App.contracts.Election = TruffleContract(election);
	    App.contracts.Election.setProvider(App.Web3Provider);
	    App.eventListen();
	    console.log("Called from init_contract");
	    return App.render();
	});
    },
    eventListen: function(){
	App.contracts.Election.deployed().then(function(instance){
	    instance.vote_cast({},{
		fromBlock: 'latest',
		toBlock: 'latest'
	    }).watch(function(error,event){
		App.render();
		console.log("Called from ev_listen");
		console.log(event);
	    });
	});
    },
    render: function(){
	var electionInstance;
	var loader = $("#loader");
	var content = $("#content");
	loader.show();
	content.hide();
	App.web3.eth.getCoinbase(function(err, account) {
	    if (err === null) {
		App.account = account;
		$("#accountAddress").html("Your Account: " + account);
	    }
	});
	App.contracts.Election.deployed().then(function(instance) {
	    electionInstance = instance;
	    return electionInstance.candidates_count(); // Returns a BigNumber Object
	}).then(function(candidates_count) {
	    candidates_count=candidates_count.toNumber(); // Convert BigNumber Object to number
	    var candidatesResults = $("#candidatesResults");
	    candidatesResults.empty();
	    var candidatesSelect = $('#candidatesSelect');
	    candidatesSelect.empty();
	    for (var i = 1; i <= candidates_count; i++) {
		electionInstance.candidates(i).then(function(candidate) {
		    var id = candidate[0]; // Fetch candidate ID
		    var voteCount = candidate[1]; // Fetch candidate vote count
		    var name = candidate[2]; // Fetch candidate name
		    var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
		    candidatesResults.append(candidateTemplate);
	            var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
		    candidatesSelect.append(candidateOption);
		});
	    }
	    return electionInstance.voted(App.account);
	}).then(function(hasVoted) {
	    if(hasVoted) {
		$('form').hide();
		//display "Your vote has been cast" message
	    }
	    loader.hide();
	    content.show();
	}).catch(function(error) {
	    console.warn(error);
	});
    },
    voteCast: function(){
	var candidateId = $('#candidatesSelect').val();
	App.contracts.Election.deployed().then(function(instance) {
	    return instance.vote(candidateId, { from: App.account });
	}).then(function(result) {
	    $("#content").hide();
	    $("#loader").show();
	}).catch(function(err) {
	    console.error(err);
	});
    }  
};
$(function() {
    $(window).load(function(){
	App.init();
    });
});
