import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import Proposal from "./Proposal.js";

const GetWinningProposal = () => {
  const [winningProposalId, setWinningProposalId] = useState(null);
  const [winningProposalDesc, setWinningProposalDesc] = useState(null);
  const [winningProposalVotes, setWinningProposalVotes] = useState(null);
  const contract = useSelector((state) => state.web3.contract);

  const getWinningProposal = async () => {
    const winningProposal = await contract.methods.getWinningProposal().call();
    const winningProposalDesc = await winningProposal[0];
    const winningProposalVotes = await winningProposal[1];
    const winningProposalId = await contract.methods.winningProposalId().call();
    setWinningProposalId(winningProposalId);
    setWinningProposalDesc(winningProposalDesc);
    setWinningProposalVotes(winningProposalVotes);
  };

  return (
    <div className="mt-5">
      <button className="btn btn-primary mb-3" onClick={getWinningProposal}>
        Get Winning Proposal
      </button>
      {winningProposalId !== null &&
        winningProposalDesc !== null &&
        winningProposalVotes !== null && (
          <Fragment>
            <h4 className="mb-3">Winning Proposal</h4>
            <Proposal
              id={winningProposalId}
              description={winningProposalDesc}
            />
          </Fragment>
        )}
    </div>
  );
};

export default GetWinningProposal;
