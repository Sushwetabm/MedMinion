import React, { useEffect, useRef, useState } from "react";
import "./AppointmentSection.css";

function AppointmentSection() {
  const [visibleBox, setVisibleBox] = useState(-1);
  const boxesRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = boxesRef.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleBox(index);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    boxesRef.current.forEach((box) => observer.observe(box));

    return () => {
      boxesRef.current.forEach((box) => observer.unobserve(box));
    };
  }, []);

  return (
    <div className="appointment-section">
      <div
        className={`box box1 ${visibleBox >= 0 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[0] = el)}
      >
        <h3>PROFILE INFORMATION</h3>
        <button className="appointment-btn">Your Appointments</button>
      </div>
      <div
        className={`box box2 ${visibleBox >= 1 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[1] = el)}
      >
        <h3>APPOINTMENT</h3>
        <button className="search-btn">Book</button><br></br>
        <button className="search-btn">Reschedule</button><br></br>
        <button className="search-btn">Cancel</button><br></br>
      </div>
      <div
        className={`box box3 ${visibleBox >= 2 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[2] = el)}
      >
        <h3>YOUR TEST RESULTS</h3>
        <button className="appointment-btn">Download test results</button>
      </div>
    </div>
  );
}

export default AppointmentSection;
