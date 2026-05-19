// Shipping address entry form.
import React from "react";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faPhone,
  faHome,
  faCity,
  faMapMarkedAlt,
  faMailBulk,
  faGlobe,
  faInfoCircle,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

// Shipping address form component that captures the recipient's details.
const ShippingAddressForm = ({ formData, errors, handleChange, countries }) => {
  return (
    <div className="delivery-section">
      <h5>
        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
        Shipping Address
      </h5>

      <Row>
        <Col md={6} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faUser} className="me-1" />
            First Name
          </Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            isInvalid={!!errors.firstName}
            required
          />
          {errors.firstName && (
            <div className="delivery-validation-error">{errors.firstName}</div>
          )}
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faUser} className="me-1" />
            Last Name
          </Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            isInvalid={!!errors.lastName}
            required
          />
          {errors.lastName && (
            <div className="delivery-validation-error">{errors.lastName}</div>
          )}
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faEnvelope} className="me-1" />
            Email
          </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
            required
          />
          {errors.email && (
            <div className="delivery-validation-error">{errors.email}</div>
          )}
        </Col>
        <Col md={6} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faPhone} className="me-1" />
            Phone Number
          </Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            isInvalid={!!errors.phone}
            required
          />
          {errors.phone && (
            <div className="delivery-validation-error">{errors.phone}</div>
          )}
        </Col>
      </Row>

      <div className="mb-3">
        <Form.Label>
          <FontAwesomeIcon icon={faHome} className="me-1" />
          Address
        </Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address, apartment, suite, etc."
          isInvalid={!!errors.address}
          required
        />
        {errors.address && (
          <div className="delivery-validation-error">{errors.address}</div>
        )}
      </div>

      <Row>
        <Col md={4} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faCity} className="me-1" />
            City
          </Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            isInvalid={!!errors.city}
            required
          />
          {errors.city && (
            <div className="delivery-validation-error">{errors.city}</div>
          )}
        </Col>
        <Col md={4} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faMapMarkedAlt} className="me-1" />
            State/Province
          </Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            isInvalid={!!errors.state}
            required
          />
          {errors.state && (
            <div className="delivery-validation-error">{errors.state}</div>
          )}
        </Col>
        <Col md={4} className="mb-3">
          <Form.Label>
            <FontAwesomeIcon icon={faMailBulk} className="me-1" />
            ZIP/Postal Code
          </Form.Label>
          <Form.Control
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            isInvalid={!!errors.zipCode}
            required
          />
          {errors.zipCode && (
            <div className="delivery-validation-error">{errors.zipCode}</div>
          )}
        </Col>
      </Row>

      <div className="mb-3">
        <Form.Label>
          <FontAwesomeIcon icon={faGlobe} className="me-1" />
          Country
          <span className="delivery-info-tooltip">
            <FontAwesomeIcon icon={faInfoCircle} className="text-muted ms-1" />
            <span className="tooltip-text">
              Select your country for accurate shipping calculations
            </span>
          </span>
        </Form.Label>
        <Form.Select
          name="country"
          value={formData.country}
          onChange={handleChange}
          isInvalid={!!errors.country}
          required
        >
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </Form.Select>
        {errors.country && (
          <div className="delivery-validation-error">{errors.country}</div>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressForm;
