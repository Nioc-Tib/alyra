import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const Notification = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.ui.message);

  const dismissAlert = () => {
    dispatch(uiActions.setNotification({ display: false }));
  };

  return (
    <div class="alert alert-success alert-dismissible fade show" role="alert">
      {message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={dismissAlert}
      ></button>
    </div>
  );
};

export default Notification;
