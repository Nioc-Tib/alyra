import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Proposal from "./Proposal";

const ListProposals = () => {
  const proposals = useSelector((state) => state.contract.proposals);

  return (
    <Fragment>
      {proposals.map((proposal) => (
        <Proposal
          key={proposal.id}
          id={proposal.id}
          description={proposal.description}
        />
      ))}
    </Fragment>
  );
};

export default ListProposals;
