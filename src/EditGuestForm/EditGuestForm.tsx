import styles from './EditGuestForm.module.css';

// Defines data types of the guest object for TypeScript
type Guest = {
  id: number;
  firstName: string;
  lastName: string;
  attending: boolean;
};

// Defines data types of the props of the component for TypeScript
type Props = {
  changedFirstName: string;
  setChangedFirstName: (name: string) => void;
  changedLastName: string;
  setChangedLastName: (name: string) => void;
  isLoading: boolean;
  setEditMode: (isOn: boolean) => void;
  updateGuestNames: (
    id: number,
    changedFirstName: string,
    changedLastName: string,
  ) => Promise<void>;
  guestToEdit: Guest;
};

export default function EditGuestForm({
  changedFirstName,
  setChangedFirstName,
  changedLastName,
  setChangedLastName,
  isLoading,
  setEditMode,
  updateGuestNames,
  guestToEdit,
}: Props) {
  // Function that updates the user data and exits edit mode when the "Save changes" button is clicked
  function handleSaveChangesButtonClick() {
    updateGuestNames(guestToEdit.id, changedFirstName, changedLastName).catch(
      (error) => console.log(error),
    );
    setEditMode(false);
  }
  return (
    <div className={styles.editGuestFormContainer}>
      {/* Form containing input fields for the names and buttons to save changes or cancel */}
      <form className={styles.editGuestForm}>
        <label htmlFor="first-name-input">First name</label>
        <input
          id="first-name-input"
          value={changedFirstName}
          onChange={(event) => setChangedFirstName(event.currentTarget.value)}
          disabled={isLoading}
        />

        <label htmlFor="last-name-input">Last name</label>
        <input
          id="last-name-input"
          value={changedLastName}
          onChange={(event) => setChangedLastName(event.currentTarget.value)}
          disabled={isLoading}
        />

        <div className={styles.buttonContainer}>
          <button
            className={styles.saveChangesButton}
            type="button"
            onClick={handleSaveChangesButtonClick}
          >
            Save changes
          </button>
          <br />
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => {
              setEditMode(false);
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
