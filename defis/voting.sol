// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.5;

/// @title A basic voting system
/// @author Ryan Loutfi

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    uint256 winningProposalId;
    uint256 maxVotes;
    uint256 proposalCounter;
    mapping(address => Voter) voters;
    WorkflowStatus state;
    mapping(uint256 => Proposal) proposals;
    mapping(string => bool) proposalToDesc;

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

    /// @dev contract owner adds an address to the whitelist
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

    /// @dev contract owner initiates proposal registration process
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

    /// @dev whitelisted address can submit their proposal
    /// @param _proposal string description of the submitted proposal
    function submitProposal(string memory _proposal)
        public
        checkStatus(state, WorkflowStatus.ProposalsRegistrationStarted)
    {
        require(voters[msg.sender].isRegistered);
        require(!proposalToDesc[_proposal], "This proposal already exist");
        proposalToDesc[_proposal] = true;
        proposals[proposalCounter].description = _proposal;
        emit ProposalRegistered(proposalCounter);
        proposalCounter++;
    }

    /// @dev contract owner ends proposal registration process
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

    /// @dev contract owner initiates voting session
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

    /// @dev whitelisted address can vote on previously submitted proposals
    /// @notice directly increments voted proposal voteCount and live updates winningProposalId
    /// @param proposalId voted proposal
    function votePrposal(uint256 proposalId)
        public
        checkStatus(state, WorkflowStatus.VotingSessionStarted)
    {
        require(voters[msg.sender].isRegistered);
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(
            bytes(proposals[proposalId].description).length != 0,
            "This proposal does not exist"
        );
        proposals[proposalId].voteCount++;
        if (proposals[proposalId].voteCount > maxVotes) {
            maxVotes = proposals[proposalId].voteCount;
            winningProposalId = proposalId;
        }
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;
        emit Voted(msg.sender, proposalId);
    }

    /// @dev contract owner ends voting session
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

    /// @dev contract owner initiates vote counting and set WorkflowStatus to Votes Tallied
    /// @notice no need for a for loop as winningProposalId was updated live during votin sessio
    function countVotes()
        public
        onlyOwner
        checkStatus(state, WorkflowStatus.VotingSessionEnded)
    {
        state = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
        emit VotesTallied();
    }

    /// @dev anyone can get winningProposal information
    /// @return returns Struct with proposal description and vote count
    function getWinningProposal()
        public
        view
        checkStatus(state, WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }
}
