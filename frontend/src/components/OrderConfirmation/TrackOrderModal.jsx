// Modal for tracking an order status.
import React from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faCheckCircle,
  faMapMarkerAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "./utils";

const TrackOrderModal = ({
  show,
  onHide,
  order,
  methodDetails,
  trackingUpdates,
  deliveryDate,
  processingDays,
}) => {
  const latestUpdate = trackingUpdates[trackingUpdates.length - 1] || null;
  const trackingNumber = order.trackingNumber || latestUpdate?.trackingNumber || "";
  const courier = order.courier || latestUpdate?.courier || "";
  const trackingLocation = order.trackingLocation || latestUpdate?.location || "";

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FontAwesomeIcon icon={faTruck} className="me-2" />
          Order Tracking
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="tracking-info">
          <h6 className="mb-3">Order #{order.id}</h6>
          <div className="mb-3">
            <p>
              <strong>Shipping Method:</strong> {methodDetails.title}
            </p>
            {(trackingNumber || courier || trackingLocation) && (
              <>
                {courier && (
                  <p>
                    <strong>Courier:</strong> {courier}
                  </p>
                )}
                {trackingNumber && (
                  <p>
                    <strong>Tracking Number:</strong> {trackingNumber}
                  </p>
                )}
                {trackingLocation && (
                  <p>
                    <strong>Current Location:</strong> {trackingLocation}
                  </p>
                )}
              </>
            )}
            <p>
              <strong>Expected Delivery:</strong> {deliveryDate}
            </p>
          </div>

          <div className="tracking-timeline">
            <h6 className="mb-3">Tracking Updates:</h6>
            {trackingUpdates.length > 0 ? (
              <div className="timeline">
                {trackingUpdates.map((update, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">{update.status}</div>
                      <div className="timeline-date">
                        {formatDate(update.timestamp)}
                      </div>
                      {update.note && (
                        <div className="timeline-note text-muted small">
                          {update.note}
                        </div>
                      )}
                      {update.location && (
                        <div className="timeline-location">
                          <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="me-1"
                          />
                          {update.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                No tracking updates available yet. Your order is being
                processed.
                <br />
                <small className="d-block mt-1">
                  Estimated processing time: {processingDays}{" "}
                  {processingDays === 1 ? "day" : "days"}
                </small>
              </Alert>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TrackOrderModal;
