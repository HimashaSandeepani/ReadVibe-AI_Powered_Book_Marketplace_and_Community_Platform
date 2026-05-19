// Shared stock manager action buttons.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faEye,
  faSync,
  faStar,
  faCheck,
  faTimes,
  faShippingFast,
  faTruck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

const ActionButtons = ({
  onEdit,
  onDelete,
  onView,
  onRestock,
  onToggleFeatured,
  onApprove,
  onReject,
  onShip,
  onUpdateTracking,
  onContact,
  isFeatured,
  isDisabled,
  showEdit = false,
  showDelete = false,
  showView = false,
  showRestock = false,
  showToggleFeatured = false,
  showApprove = false,
  showReject = false,
  showShip = false,
  showUpdateTracking = false,
  showContact = false,
  size = "sm",
}) => {
  const buttonClass = `btn btn-${size}`;

  return (
    <div className="stock-manager-action-buttons">
      {showView && (
        <button
          className={`${buttonClass} btn-outline-primary me-1`}
          onClick={onView}
          title="View"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faEye} />
        </button>
      )}
      {showEdit && (
        <button
          className={`${buttonClass} btn-outline-primary me-1`}
          onClick={onEdit}
          title="Edit"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      {showRestock && (
        <button
          className={`${buttonClass} btn-outline-success me-1`}
          onClick={onRestock}
          title="Restock"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faSync} />
        </button>
      )}
      {showToggleFeatured && (
        <button
          className={`${buttonClass} btn-outline-warning me-1`}
          onClick={onToggleFeatured}
          title={isFeatured ? "Remove from Featured" : "Mark as Featured"}
          disabled={isDisabled}
        >
          <FontAwesomeIcon
            icon={isFeatured ? faStar : faStarRegular}
            className={isFeatured ? "text-warning" : ""}
          />
        </button>
      )}
      {showApprove && (
        <button
          className={`${buttonClass} btn-outline-success me-1`}
          onClick={onApprove}
          title="Approve"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
      )}
      {showReject && (
        <button
          className={`${buttonClass} btn-outline-danger me-1`}
          onClick={onReject}
          title="Reject"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      {showShip && (
        <button
          className={`${buttonClass} btn-outline-success me-1`}
          onClick={onShip}
          title="Mark as Shipped"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faShippingFast} />
        </button>
      )}
      {showUpdateTracking && (
        <button
          className={`${buttonClass} btn-outline-info me-1`}
          onClick={onUpdateTracking}
          title="Update Tracking"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faTruck} />
        </button>
      )}
      {showContact && (
        <button
          className={`${buttonClass} btn-outline-primary me-1`}
          onClick={onContact}
          title="Contact"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      )}
      {showDelete && (
        <button
          className={`${buttonClass} btn-outline-danger`}
          onClick={onDelete}
          title="Delete"
          disabled={isDisabled}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
