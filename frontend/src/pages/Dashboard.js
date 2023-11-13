import React, { useState, useEffect } from "react";
import { VictoryPie, VictoryTheme } from "victory";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [totalStatistics, setTotalStatistics] = useState(null);
  const [eventWiseStatistics, setEventWiseStatistics] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:4000/api/events/getStatistics"
        );
        const data = await response.json();
        setTotalStatistics(data.totalStats);
        setEventWiseStatistics(data.eventWiseStats);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className={styles["dashboard-container"]}>
      <h1>Event Dashboard</h1>

      {totalStatistics && (
        <div className={styles["info-container"]}>
          <h2>Total Statistics</h2>
          <p>Total Bookings: {totalStatistics.totalTicketsSold}</p>
          <p>Total Revenue: ₹{totalStatistics.totalRevenue}</p>
        </div>
      )}

      {eventWiseStatistics.length > 0 && (
        <div className={styles["statistics-container"]}>
          <h2>Event-wise Statistics</h2>

          <div>
            {/* <div className={styles["bar-chart-container"]}>
              <VictoryBar
                data={eventWiseStatistics}
                x="Event_Name"
                y="totalTicketsSold"
                labels={({ datum }) => datum.totalTicketsSold}
                style={{
                  data: { fill: "#3498db" },
                  labels: { fill: "#2c3e50", fontSize: 12, fontWeight: "bold"},
                }}
                theme={VictoryTheme.material}
                />
                <h3>Total Tickets Sold by Event</h3>
            </div> */}

            <div className={styles["pie-chart-container"]}>
              <div className={styles["pie-chart"]}>
              <VictoryPie
                data={eventWiseStatistics}
                x="Event_Name"
                y="totalTicketsSold"
                labels={({ datum }) =>
                `${datum.Event_Name}\n${datum.totalTicketsSold}`
              }
              style={{
                labels: { fill: "#2c3e50", fontSize: 15, fontWeight: "bold" },
              }}
              theme={VictoryTheme.material}
              width={500}
              height={500}
              />
              </div>
              <h3>Percentage of Tickets Sold by Event</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
