import express from "express";
import cors from "cors";
import pg from "pg";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 4000;

const db = new pg.Client({
    user: "XXX",
    host: "localhost",
    database: "test",
    password: "XXX",
    port: 5432,
  });

  db.connect();

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("../frontend/public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


let contacts = [];

async function getContacts() {    
        try {
            const result = await db.query("SELECT * FROM contact ORDER BY id");
            return  contacts = result.rows; 
        } catch (err) {
            console.error("Error fetching contacts:", err);
            throw err;
        }
    }

app.get("/contacts", async (req, res) => {
   try {
    await getContacts(); 
     
     res.json({contacts: contacts});
     console.log(contacts)

    } catch (err) {
        console.error(err);
    }
  });


app.post("/createContact", async (req, res) => {
    const { name, color } = req.body;

    if (!name|| !color) {
      return res.status(400).json({
          message: "You must include a name and a color!"
      });
  }
     try {
        await db.query(
            "INSERT INTO contact (name, color) VALUES ($1, $2)",
            [name, color]
          );
          
          res.redirect("/contacts");
        }  catch (err) {
            console.error(err);
          }
   } );


app.patch("/updateContact/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, color } = req.body;
    try {
       const query = await db.query("SELECT * FROM contact WHERE id = $1", [id]);
       console.log(query);
  
           
        if (query.length === 0) {return res.status(404).json({ message: "Contact not found" });}     
        
        const result = await db.query(
           'UPDATE contact SET name = COALESCE($1, name), color = COALESCE($2, color) WHERE id = $3 RETURNING *',
            [name || null, color || null, id]);
        
        const updatedContact = result.rows[0];
    
      res.json({ message: `Contact with id ${id} updated` })  
    } catch (err) {
      console.error("Error executing query", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/deleteContact/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  console.log(contacts)
  try {
      await getContacts();
      console.log(contacts)
      console.log(id);
      const foundContact = contacts.find((contact) => contact.id === id);
      const idOfContact = foundContact.id;
     
      if (idOfContact === -1) return res.status(404).json({ message: "Contact not found" });
      
      const result = await db.query(`DELETE FROM contact WHERE id = $1`, [idOfContact]);

      res.json({ message: `Contact with id ${idOfContact} deleted` });
      } catch (err) {
      console.error(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

    
//result.forEach((contact) => {
    //contacts.push(contact);
  //});
    //return contacts;
//}


  
  //async function getCurrentUser() {
    //const result = await db.query("SELECT * FROM users");
    //users = result.rows;
    //return users.find((user) => user.id == currentUserId);
  //}
  



