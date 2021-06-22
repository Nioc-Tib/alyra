import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const Notification = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.ui.message);
  const type = useSelector((state) => state.ui.type);

  const dismissAlert = () => {
    dispatch(uiActions.setNotification({ display: false }));
  };

  return (
    <Fragment>
      {type === "success" && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={dismissAlert}
          ></button>
        </div>
      )}
      {type === "failure" && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={dismissAlert}
          ></button>
        </div>
      )}
    </Fragment>
  );
};

export default Notification;
