// Stock manager publishers tab.
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faBuilding,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../Common/StatusBadge";
import ActionButtons from "../Common/ActionButtons";

const PublishersTab = ({
  publishers,
  onAddPublisher,
  onEditPublisher,
  onContactPublisher,
  onDeletePublisher,
}) => {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Publisher Management</h2>
        <button className="btn btn-primary" onClick={onAddPublisher}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Publisher
        </button>
      </div>

      <div className="row mb-4">
        {publishers.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No publishers found</p>
            <button className="btn btn-primary mt-2" onClick={onAddPublisher}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Your First Publisher
            </button>
          </div>
        ) : (
          publishers.map((publisher) => (
            <div key={publisher.id} className="col-md-6 col-lg-4 mb-3">
              <div className="stock-manager-dashboard-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">{publisher.id}</span>
                  <StatusBadge status={publisher.status} type="publisher" />
                </div>
                <h5 className="mb-3">{publisher.name}</h5>
                <div className="mb-3">
                  <div className="d-flex align-items-center mb-1">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span>{publisher.email}</span>
                  </div>
                  <div className="d-flex align-items-center mb-1">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span>{publisher.phone}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faBuilding}
                      className="text-muted me-2"
                      size="sm"
                    />
                    <span className="small">{publisher.address}</span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="small text-muted">Books Supplied</div>
                    <div className="fw-bold">{publisher.booksSupplied}</div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-primary grow"
                    onClick={() => onContactPublisher(publisher.id)}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="me-1" />
                    Contact
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary grow"
                    onClick={() => onEditPublisher(publisher)}
                  >
                    Edit
                  </button>
                  <ActionButtons
                    onDelete={() => onDeletePublisher(publisher.id)}
                    showDelete={true}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default PublishersTab;
