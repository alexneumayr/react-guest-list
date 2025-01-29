import './App.css';
import { useEffect, useState } from 'react';

const baseUrl = 'http://localhost:4000';

async function createGuest(firstName, lastName) {
  const response = await fetch(`${baseUrl}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName }),
  });
  const createdGuest = await response.json();
  console.log('API response from createGuest()', createdGuest);
}

async function deleteGuest(id) {
  const response = await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
  const deletedGuest = await response.json();
  console.log('API response from deleteGuest()', deletedGuest);
}

async function toggleGuestAttending(id, checkboxStatus) {
  const response = await fetch(`${baseUrl}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: checkboxStatus }),
  });
  const updatedGuest = await response.json();
  console.log('API response from toggleGuestAttending()', updatedGuest);
}

export default function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allGuests, setAllGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  function handleFormSubmit(event) {
    event.preventDefault();

    createGuest(firstName, lastName).catch((error) => console.log(error));
    /* setFirstName('');
    setLastName(''); */
  }

  async function getAllGuests() {
    const response = await fetch(`${baseUrl}/guests`);
    setAllGuests(await response.json());
    if (isLoading) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllGuests().catch((error) => console.log(error));
  });

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="first-name-input">First name</label>
        <input
          id="first-name-input"
          value={firstName}
          onChange={(event) => setFirstName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <br />
        <label htmlFor="last-name-input">Last name</label>
        <input
          id="last-name-input"
          value={lastName}
          onChange={(event) => setLastName(event.currentTarget.value)}
          disabled={isLoading}
        />
        <input type="submit" hidden />
      </form>
      {isLoading ? (
        'Loading...'
      ) : (
        <div>
          {allGuests.map((guest) => {
            return (
              <div data-test-id="guest" key={`guest-${guest.id}`}>
                {guest.firstName} {guest.lastName}{' '}
                <button onClick={() => deleteGuest(guest.id)}>Remove</button>
                <input
                  type="checkbox"
                  value={guest.attending}
                  aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                  onChange={(event) => {
                    toggleGuestAttending(
                      guest.id,
                      event.currentTarget.checked,
                    ).catch((error) => console.log(error));
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
