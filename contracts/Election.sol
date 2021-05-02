pragma solidity ^0.5.0;

contract Election{
    uint public votes_count=0; // Count of the total number of votes
    uint public candidates_count=0; // Count of the total number of candidates
    struct Vote{
	uint id; // Each vote has a unique ID
	uint vote_time; // Stores the time at which a vote was cast
	string candidate; // stores the name of the candidate to whom the vote was cast
    }
    struct Candidate{
	uint id; // Each candidate has an ID
	uint votes_recieved; // Count of the number of votes received
	string name; // Name of the candidate
    }
    event vote_cast(uint indexed _candidate_id); // Event triggered after a vote is cast using the vote method
    mapping(uint => Candidate) public candidates; // List of all candidates
    mapping(uint => Vote) public votes; // List of all votes
    mapping(address => bool) public voted; // Used to keep track if a user has cast a vote
    constructor() public{
	add_candidate("Candidate A");
	add_candidate("Candidate B");
    }
    function add_candidate(string memory _name) private{ // Candidate creation function
	candidates_count++;
	candidates[candidates_count]=Candidate(candidates_count,0,_name);
    }
    function vote(uint _candidate_id) public{ // Vote cast function
	require(!voted[msg.sender]);
	require(_candidate_id>0 && _candidate_id<=candidates_count);
	voted[msg.sender]=true;
	add_vote(candidates[_candidate_id].name);
	candidates[_candidate_id].votes_recieved++;
	emit vote_cast(_candidate_id);
    }
    function add_vote(string memory _candidate_name) private{ //
	votes_count++;
	votes[votes_count]=Vote(votes_count,now,_candidate_name);
    }
}
