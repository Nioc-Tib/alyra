const { BN, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const VOTING = artifacts.require("./Voting.sol");

contract("VOTING", async (accounts) => {
  const owner = accounts[0];
  const voter = accounts[1];
  let VOTINGInstance;

  beforeEach(async function () {
    VOTINGInstance = await VOTING.new({ from: owner });
  });

  it("whitelist an address", async () => {
    const receipt = await VOTINGInstance.whitelist(voter, { from: owner });
    const voters = await VOTINGInstance.getVoters();
    const registered = voters.includes(voter);
    expect(registered).to.be.true;
    expectEvent(receipt, "VoterRegistered", { voterAddress: voter });
  });

  it("owner can change workflow", async () => {
    const receipt = await VOTINGInstance.startProposalRegistration({
      from: owner,
    });
    const state = await VOTINGInstance.state();
    expect(state).to.be.bignumber.equal(new BN(1));
    expectEvent(receipt, "ProposalsRegistrationStarted");
  });

  it("can submit proposal", async () => {
    await VOTINGInstance.whitelist(voter, { from: owner });
    await VOTINGInstance.startProposalRegistration({
      from: owner,
    });
    const proposal = "Test Proposal";
    const receipt = await VOTINGInstance.submitProposal(proposal, {
      from: voter,
    });
    const submitted = await VOTINGInstance.checkProposalExists(proposal);
    const proposalCounter = await VOTINGInstance.proposalCounter();
    const proposalId = new BN(proposalCounter - 1);
    expect(submitted).to.be.true;
    expect(proposalCounter).to.be.bignumber.equal(new BN(1));
    expectEvent(receipt, "ProposalRegistered", { proposalId: proposalId });
  });

  it("can vote proposal", async () => {
    const proposal = "Test Proposal";

    await VOTINGInstance.whitelist(voter, { from: owner });
    await VOTINGInstance.startProposalRegistration({
      from: owner,
    });

    await VOTINGInstance.submitProposal(proposal, {
      from: voter,
    });

    const proposalCounter = await VOTINGInstance.proposalCounter();
    const proposalId = new BN(proposalCounter - 1);

    await VOTINGInstance.endProposalRegistration({ from: owner });
    await VOTINGInstance.startVotingSession({ from: owner });
    const receipt = await VOTINGInstance.voteProposal(proposalId, {
      from: voter,
    });
    const hasVoted = await VOTINGInstance.hasVoted(voter);
    const proposalVoteCount = await VOTINGInstance.getProposalVotes(proposalId);
    expect(hasVoted).to.be.true;
    expect(proposalVoteCount).to.be.bignumber.equal(new BN(1));
    expectEvent(receipt, "Voted", { voter, proposalId });
  });

  it("can count votes", async () => {
    const proposal = "Test Proposal";

    await VOTINGInstance.whitelist(voter, { from: owner });
    await VOTINGInstance.startProposalRegistration({
      from: owner,
    });
    await VOTINGInstance.submitProposal(proposal, {
      from: voter,
    });
    await VOTINGInstance.endProposalRegistration({ from: owner });
    await VOTINGInstance.startVotingSession({ from: owner });
    await VOTINGInstance.endVotingSession({ from: owner });

    const receipt = await VOTINGInstance.countVotes({ from: owner });
    const state = await VOTINGInstance.state();

    expect(state).to.be.bignumber.equal(new BN(5));
    expectEvent(receipt, "VotesTallied");
  });

  it("can get winning proposal", async () => {
    const proposal = "Test Proposal";

    await VOTINGInstance.whitelist(voter, { from: owner });
    await VOTINGInstance.startProposalRegistration({
      from: owner,
    });
    await VOTINGInstance.submitProposal(proposal, {
      from: voter,
    });
    await VOTINGInstance.endProposalRegistration({ from: owner });
    await VOTINGInstance.startVotingSession({ from: owner });
    await VOTINGInstance.endVotingSession({ from: owner });
    await VOTINGInstance.countVotes({ from: owner });

    const winningProposalDesc = await VOTINGInstance.getWinningProposal();
    const winningProposalId = await VOTINGInstance.winningProposalId();

    expect(winningProposalId).to.be.bignumber.equal(new BN(0));
    expect(winningProposalDesc[0]).to.be.equal(proposal);
  });
});
