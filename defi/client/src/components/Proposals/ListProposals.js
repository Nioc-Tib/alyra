import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Proposal from "./Proposal";

const ListProposals = () => {
  const proposals = useSelector((state) => state.contract.proposals);

  return (
    <div className="mt-5">
      {proposals.map((proposal) => (
        <Proposal
          key={proposal.id}
          id={proposal.id}
          description={proposal.description}
        />
      ))}
    </div>
  );
};

export default ListProposals;
