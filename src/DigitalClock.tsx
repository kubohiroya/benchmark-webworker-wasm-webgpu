import React, { useState, useEffect, useCallback } from "react";

// Props interface (if needed for customization in the future)
interface DigitalClockProps {
  fontSize?: string;
  format12Hour?: boolean; // Optional prop to toggle between 12-hour and 24-hour formats
}

const DigitalClock: React.FC<DigitalClockProps> = ({
  fontSize = "5rem",
  format12Hour = false,
}) => {
  // State to hold the current time
  const [currentTime, setCurrentTime] = useState<string>("");

  // Function to format the time based on 12-hour or 24-hour format
  const formatTime = useCallback(
    (date: Date): string => {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliSeconds = date.getMilliseconds();
      let period = "";

      if (format12Hour) {
        period = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert to 12-hour format
      }

      const paddedHours = hours.toString().padStart(2, "0");
      const paddedMinutes = minutes.toString().padStart(2, "0");
      const paddedSeconds = seconds.toString().padStart(2, "0");
      const paddedMilSeconds = milliSeconds
        .toString()
        .padStart(3, "0")
        .substring(0, 2);

      return `${paddedHours}:${paddedMinutes}:${paddedSeconds}.${paddedMilSeconds} ${period}`.trim();
    },
    [format12Hour],
  );

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    };
    updateCurrentTime();
    // Update the time every second
    const intervalId = setInterval(() => {
      updateCurrentTime();
    }, 10);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [formatTime, format12Hour]); // Re-run effect if format12Hour changes

  return (
    <div style={{ fontFamily: "monospace", fontSize, textAlign: "center" }}>
      {currentTime}
    </div>
  );
};

export default DigitalClock;
