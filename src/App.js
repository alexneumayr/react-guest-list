import './App.css';
import { useState } from 'react';

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guests, setGuests] = useState([]);
  /* guest object properties: id, firstName, lastName, attending */

  function handleFormSubmit(event) {
    event.preventDefault();
    const tempGuestArray = [
      ...guests,
      { firstName: firstName, lastName: lastName, attending: false },
    ];
    setGuests(tempGuestArray);
    setFirstName('');
    setLastName('');
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="first-name-input">First name</label>
        <input
          id="first-name-input"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
        />
        <br />
        <label htmlFor="last-name-input">Last name</label>
        <input
          id="last-name-input"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
        />
        <input type="submit" hidden />
      </form>
      <div>
        {guests.map((guest) => {
          return (
            <div data-test-id="guest">
              {guest.firstName} {guest.lastName}
            </div>
          );
        })}
      </div>
    </>
  );
}
