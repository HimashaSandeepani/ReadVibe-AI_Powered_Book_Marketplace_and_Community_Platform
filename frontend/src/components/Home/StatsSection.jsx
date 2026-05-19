// Home page section that highlights platform metrics.
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faUsers,
  faSmile,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

// Reads the stored book count for the home page stats section.
const getStoredBookCount = () => {
  try {
    const storedBooks = JSON.parse(localStorage.getItem("stockBooks")) || [];
    return storedBooks.length;
  } catch (error) {
    console.error("Failed to read stock books from storage", error);
    return 0;
  }
};

// Home page section that highlights platform metrics.
const StatsSection = () => {
  const [bookCount, setBookCount] = useState(() => getStoredBookCount());

  useEffect(() => {
    // Keeps the metric in sync when stock data changes.
    const handleStorageUpdate = () => {
      setBookCount(getStoredBookCount());
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  // Metric cards displayed on the home page.
  const stats = [
    {
      icon: faBook,
      value: `${bookCount}+`,
      label: "Books Available",
    },
    {
      icon: faUsers,
      value: "50,000+",
      label: "Active Readers",
    },
    {
      icon: faSmile,
      value: "95%",
      label: "Satisfaction Rate",
    },
    {
      icon: faBrain,
      value: "24/7",
      label: "AI Recommendations",
    },
  ];

  return (
    <Container className="my-5 stats-section">
      <Row>
        {stats.map((stat, index) => (
          <Col md={3} xs={6} key={index} className="mb-4">
            <div className="stats-card">
              <div className="stats-number">
                <FontAwesomeIcon icon={stat.icon} className="me-2" />
                {stat.value}
              </div>
              <div className="stats-label">{stat.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StatsSection;
