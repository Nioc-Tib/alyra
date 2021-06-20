import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
