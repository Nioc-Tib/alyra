// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/1488d4f6782f76f74f3652e44da9b9e241146ccb/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint256 winningProposalId;
    uint256 maxVotes;
    uint256 proposalCounter;
    mapping(address => Voter) voters;
    WorkflowStatus state;
    mapping(uint256 => Proposal) proposals;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress);
    event ProposalsRegistrationStarted();
    event ProposalsRegistrationEnded();
    event ProposalRegistered(uint256 proposalId);
    event VotingSessionStarted();
    event VotingSessionEnded();
    event Voted(address voter, uint256 proposalId);
    event VotesTallied();
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    modifier checkStatus(
        WorkflowStatus currentStatus,
        WorkflowStatus requiredStatus
    ) {
        require(currentStatus == requiredStatus);
        _;
    }

    function whitelist(address _address)
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.RegisteringVoters)
    {
        require(
            !voters[_address].isRegistered,
            "This address is already whitelisted"
        );
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function startProposalRegistration()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.RegisteringVoters)
    {
        state = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
        emit ProposalsRegistrationStarted();
    }

    function submitProposal(string memory _proposal)
        public
        checkStatus(state, WorkflowStatus.ProposalsRegistrationStarted)
    {
        require(voters[msg.sender].isRegistered);
        proposals[proposalCounter].description = _proposal;
        emit ProposalRegistered(proposalCounter);
        proposalCounter++;
    }

    function endProposalRegistration()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.ProposalsRegistrationStarted)
    {
        state = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
        emit ProposalsRegistrationEnded();
    }

    function startVotingSession()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.ProposalsRegistrationEnded)
    {
        state = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
        emit VotingSessionStarted();
    }

    function votePrposal(uint256 proposalId)
        public
        checkStatus(state, WorkflowStatus.VotingSessionStarted)
    {
        require(voters[msg.sender].isRegistered);
        proposals[proposalId].voteCount++;
        if (proposals[proposalId].voteCount > maxVotes) {
            maxVotes = proposals[proposalId].voteCount;
            winningProposalId = proposalId;
        }
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;
        emit Voted(msg.sender, proposalId);
    }

    function endVotingSession()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.VotingSessionStarted)
    {
        require(state == WorkflowStatus.VotingSessionStarted);
        state = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
        emit VotingSessionEnded();
    }

    function countVotes()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.VotingSessionEnded)
    {
        state = WorkflowStatus.VotesTallied;
        WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
        emit VotesTallied();
    }

    function getWinningProposal()
        public
        view
        checkStatus(state, WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }
}
