var Election=artifacts.require("./Election.sol");
contract('Election',(accounts)=>{
    before(async()=>{
	this.election=await Election.deployed();
    })
    it("Correct initialization", async ()=> {
	c_count=await this.election.candidates_count();
	v_count=await this.election.votes_count();
	assert.equal(c_count,2);
	assert.equal(v_count,0);
    })
})
