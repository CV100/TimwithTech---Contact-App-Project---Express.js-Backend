import React from "react";

const ContactList = ({contacts, updateContact, updateCallback}) => {

    const onDelete = async (id) => {
        try {
            const options = {
                method: "DELETE"
            };
            const response = await fetch(`http://localhost:4000/deleteContact/${id}`, options);
            if (response.status === 200) {
                updateCallback();
            } else {
                console.error("Failed to delete the contact");
            }
        } catch (err) {
            console.error(err);
          }
    };

    return (<div>
        <h2>
            Contacts
        </h2>
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Color</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {contacts.map((contact) => (
                    <tr key = {contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.color}</td>
                        
                        <td>
                            <button onClick={() => updateContact(contact)}>Update</button>
                            <button onClick={() => onDelete(contact.id)}>Delete</button>
                        </td>
                    </tr>
                    
                ))}
            </tbody>

        </table>
    </div>
    )
};

export default ContactList;