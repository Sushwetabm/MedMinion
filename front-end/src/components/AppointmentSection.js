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
        <h3>Opening Hours</h3>
        <p>Mon - Fri: 8:00am - 9:00pm</p>
        <p>Saturday: 8:00am - 7:00pm</p>
        <p>Sunday: 8:00am - 5:00pm</p>
        <button className="appointment-btn">Make Appointment</button>
      </div>
      <div
        className={`box box2 ${visibleBox >= 1 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[1] = el)}
      >
        <h3>Search A Doctor</h3>
        <input type="date" placeholder="Appointment Date" />
        <select>
          <option>Select A Service</option>
          <option>DOption 1</option>
          <option>DOption 2</option>
          <option>DOption 3</option>
          <option>DOption 4</option>
          <option>DOption 5</option>
        </select>
        <button className="search-btn">Search Doctor</button>
      </div>
      <div
        className={`box box3 ${visibleBox >= 2 ? "show" : ""}`}
        ref={(el) => (boxesRef.current[2] = el)}
      >
        <h3>Make Appointment</h3>
        <p>+012 345 6789</p>
        <button className="appointment-btn">Make Appointment</button>
      </div>
    </div>
  );
}

export default AppointmentSection;
