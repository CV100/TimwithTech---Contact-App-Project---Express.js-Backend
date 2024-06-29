import React, { useState, useEffect } from 'react';
import "./App.css";

import ContactList from './ContactList';
import ContactForm from './ContactForm';

function App() {
  const [contacts, setContacts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({});

    useEffect(() => {
      fetchContacts();
    }, []);

      const fetchContacts = async () => {
      const response = await fetch("http://localhost:4000/contacts");
      const data = await response.json();
        setContacts(data.contacts);
      };

  const closeModal= () => { //Exit symbol
    setModalOpen(false);
    setCurrentContact({});
  };

  const openModal = () => {//Opens model to create Contact
    if (!modalOpen) setModalOpen(true);
  };

  const openUpdateModal = (contact) => { //becomes updateContact prop for ContactList, used to bring back the contact that was clicked on in the List.
    if (modalOpen) return
    setCurrentContact(contact);
    setModalOpen(true);
    console.log(contact);
  }

  const onUpdate =() => { // becomes updatCallback prop for ContactList + ContactForm, in order to mark end of process (like PATCH or DELETE method)
    closeModal();
    fetchContacts();
  }

  return (
    <>
    <ContactList contacts={contacts} updateContact={openUpdateModal} updateCallback={onUpdate}/>
  
  <button onClick={openModal}>Create new contact</button>
  
  {modalOpen && 
  <div className="modal">
    <div className="modal-content">
      
      <span className="close" onClick={closeModal}>&times;</span>

      <ContactForm existingContact={currentContact} updateCallback={onUpdate}/>

    </div>
  </div>}
  </>)
  };

export default App;
