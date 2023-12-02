// src/App.js
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

const App = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [timezone, setTimezone] = useState('UTC'); // Set default timezone
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Replace 'data.json' with the path to your actual JSON file
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setAppointments(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const changeWeek = (amount) => {
    setCurrentDate(currentDate.clone().tz(timezone).add(amount, 'weeks'));
  };

  const days = Array.from({ length: 5 }, (_, i) => currentDate.clone().tz(timezone).startOf('isoWeek').add(i, 'days'));
  const timeSlots = [
    '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM',
    '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
    '10:00 PM', '10:30 PM', '11:00 PM',
  ];

  // Function to check if the timeslot is in the past
  const isPastTimeSlot = (day, time) => {
    const timeMoment = moment.tz(`${day.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm A', timezone);
    return timeMoment.isBefore(moment.tz(timezone));
  };

  // Function to check if a checkbox should be checked based on appointments
  const isChecked = (day, time) => {
    return appointments.some(appointment => 
      day.isSame(moment.tz(appointment.Date, timezone), 'day') && 
      moment.tz(`${appointment.Date} ${appointment.Time}`, 'YYYY-MM-DD hh:mm A', timezone).format('h:mm A') === time
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => changeWeek(-1)}>Previous Week</button>
        <div>
          <strong>{currentDate.tz(timezone).format('MMMM D, YYYY')}</strong>
        </div>
        <button onClick={() => changeWeek(1)}>Next Week</button>
      </div>
      <div>
  <label htmlFor="timezone-selector">Timezone:</label>
  <select
    id="timezone-selector"
    value={timezone}
    onChange={(e) => setTimezone(e.target.value)}
    style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} // Adjust the width to 100% of the parent container
  >
    <option value="UTC">[UTC-0] Estern Standard Time</option>
    <option value="America/New_York">[UTC-] America/New_York</option>
  </select>
</div>

      <br></br><br></br>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>

      <tbody>
  {days.map(day => (
    <tr key={day}>
      <td style={{
        border: '1px solid #ddd', 
        padding: '8px', 
        backgroundColor: isPastTimeSlot(day, '12:00 AM') ? '#f8d7da' : '',
        verticalAlign: 'top'  // Align the content to the top of the cell
      }}>
        <div>{day.format('ddd')}</div>  {/* Weekday (e.g., Mon) */}
        <div>{day.format('M/D')}</div>  {/* Date (e.g., 11/6) */}
      </td>
      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {isPastTimeSlot(day, '12:00 AM') ? (
            <span>Past</span>  // This will display "Past" for past days in the timeslots column
          ) : (
            timeSlots.map((time, index) => (
              <label key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <span>{moment.tz(`${day.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm A', timezone).format('h:mm A')}</span>
                <input type="checkbox" checked={isChecked(day, time)} style={{ marginLeft: '5px' }} />
              </label>
            ))
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default App;
