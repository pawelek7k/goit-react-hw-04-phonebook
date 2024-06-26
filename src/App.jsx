import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import "./App.css";
import { ContactList } from "./components/ContactsList/ContactsList";
import Filter from "./components/Filter/Filter";
import { ContactForm } from "./components/FormComponent/ContactForm";
import { Section } from "./components/Section/Section";

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const loadContactsFromStorage = () => {
      const storedContacts = localStorage.getItem("contacts");
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    };

    loadContactsFromStorage();
  }, []);

  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
    applyFilter(contacts, filter);
  }, [contacts, filter]);

  const handleAddContact = (newContact) => {
    const isDuplicate = contacts.some(
      (contact) => contact.number === newContact.number
    );

    if (isDuplicate) {
      alert("Contact with this name already exists in the phonebook!");
      return;
    }
    const updatedContacts = [...contacts, { ...newContact, id: nanoid() }];
    setContacts(updatedContacts);
  };

  const applyFilter = (contactsList, filterValue) => {
    let filtered = contactsList;
    if (filterValue && filterValue.trim() !== "") {
      filtered = contactsList.filter(
        (contact) =>
          contact.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          contact.number.includes(filterValue)
      );
    }
    setFilteredContacts(filtered);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    applyFilter(contacts, value);
  };
  const onDeleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
  };

  return (
    <>
      <Section title="Phonebook">
        <ContactForm onAddContact={handleAddContact} />
      </Section>
      <Section title="Contacts">
        <Filter onFilterChange={handleFilterChange} />
        <ContactList
          contacts={filteredContacts}
          onDeleteContact={onDeleteContact}
        />
      </Section>
    </>
  );
}

export default App;
