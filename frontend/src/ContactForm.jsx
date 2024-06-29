import React, {useState} from "react";


const ContactForm = ({existingContact = {}, updateCallback}) => {
    const [contact, setContact] = useState({
      name: existingContact.name || "",
      color: existingContact.color || "",
    })

    
    const updating = Object.entries(existingContact).length !== 0;
 

            function handleChange(e) {
                const {name, value} = e.target;
                setContact((prevValue) => ({
                 ...prevValue,
                    [name]: value,
                }));
            };

    
    const onSubmit = async (event) => {
        event.preventDefault();
        
        const data = {
            name: contact.name,
            color: contact.color,
        };

        const url = "http://localhost:4000/" + (updating ? `updateContact/${existingContact.id}` : `createContact`);
        
        const options = {
            method: updating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(url, options)

        if (response.status !== 201 && response.status !== 200) {
            const data = await response.json();
            alert(data.message)
        } else {
            updateCallback();
        }
    }


return <form onSubmit={onSubmit}>
    <div>
        <label htmlFor="name">Name</label>
        <input 
        type="text"
        name="name"
        id="name"
        value={contact.name}
        onChange={handleChange}  />
    </div>
    <div>
        <label htmlFor="color">Color</label>
        <input type="text"
        name="color"
        id="name"   
        value={contact.color}
        onChange={handleChange} />
    </div>
    <button type="submit">{updating? "Update" : "Create"}</button>
</form>

};


    export default ContactForm;