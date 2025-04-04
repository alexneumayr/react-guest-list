// Sets the base URL for all API functions
const baseUrl = 'https://alexneumayr-express-gue-54.deno.dev';

// Defines data types of the guest object for TypeScript
type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  attending: boolean;
};

// Function to create a new guest
export async function createGuest(firstName: string, lastName: string) {
  const response = await fetch(`${baseUrl}/guests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName: firstName, lastName: lastName }),
  });
  const createdGuest: Guest = await response.json();
  console.log('API response from createGuest()', createdGuest);
  return createdGuest;
}

// Function to delete a single guest
export async function deleteGuest(id: number) {
  const response = await fetch(`${baseUrl}/guests/${id}`, { method: 'DELETE' });
  const deletedGuest: Guest = await response.json();
  console.log('API response from deleteGuest()', deletedGuest);
  return deletedGuest;
}

// Function to toggle the attending status of a guest
export async function toggleGuestAttending(
  id: number,
  checkboxStatus: boolean,
) {
  const response = await fetch(`${baseUrl}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: checkboxStatus }),
  });
  const updatedGuest: Guest = await response.json();
  console.log('API response from toggleGuestAttending()', updatedGuest);
  return updatedGuest;
}

// Function to change the names of a guest
export async function updateGuestNames(
  id: number,
  changedFirstName: string,
  changedLastName: string,
) {
  const response = await fetch(`${baseUrl}/guests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: changedFirstName,
      lastName: changedLastName,
    }),
  });
  const updatedGuest: Guest = await response.json();
  console.log('API response from updateGuestNames()', updatedGuest);
  return updatedGuest;
}

// Function to fetch the guest list and apply the filter
export async function getGuests(
  setAllGuests: (guests: Guest[]) => void,
  filter: { status: string },
  isLoading: boolean,
  setIsLoading: (loadingStatus: boolean) => void,
) {
  const response = await fetch(`${baseUrl}/guests`);
  const allGuests: Guest[] = await response.json();
  console.log('Fetched guest list data');
  switch (filter.status) {
    case 'attending':
      setAllGuests(
        allGuests.filter((guest: Guest) => {
          return guest.attending;
        }),
      );
      break;
    case 'notattending':
      setAllGuests(
        allGuests.filter((guest: Guest) => {
          return !guest.attending;
        }),
      );
      break;
    case 'all':
      setAllGuests(allGuests);
      break;
    default:
      throw new Error('Error filtering guests');
  }

  if (isLoading) {
    setIsLoading(false);
  }
}

// Function to get the data of a specific guest
export async function getSingleGuestForEditing(
  id: number,
  setGuestToEdit: (guest: Guest) => void,
  setChangedFirstName: (name: string) => void,
  setChangedLastName: (name: string) => void,
) {
  const response = await fetch(`${baseUrl}/guests/${id}`);
  const guestForEditing: Guest = await response.json();
  setGuestToEdit(guestForEditing);
  setChangedFirstName(guestForEditing.firstName);
  setChangedLastName(guestForEditing.lastName);
}
