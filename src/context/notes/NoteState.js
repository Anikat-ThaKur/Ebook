
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState=(props)=>{
  const host="http://localhost:5000"
 
      const notesInitial=[];
      const [notes, setNotes] = useState(notesInitial)


      
      //getallnotes
      const getNotes=async ()=>{
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method:'GET',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIxMzcyMGE2MDU2MjE5YmRlMGM0M2QwIn0sImlhdCI6MTY0NTUxMjEzM30.e5-LiMpGjWHW_PpiqJAXvLvCpmN6y3ZMF28LTB8JHEo"
          }
        });
        const json=await response.json();
        console.log(json);
        setNotes(json)
      }
      //add a note
      const addnote=async (title,description,tag)=>{
        const response = await fetch(`${host}/api/notes/addnote`, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIxMzcyMGE2MDU2MjE5YmRlMGM0M2QwIn0sImlhdCI6MTY0NTUxMjEzM30.e5-LiMpGjWHW_PpiqJAXvLvCpmN6y3ZMF28LTB8JHEo"
          },
          body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
        });
        const note =await response.json()
        setNotes(notes.concat(note))

      }
      //delet a note
      const deletenote= async (id)=>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method:'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIxMzcyMGE2MDU2MjE5YmRlMGM0M2QwIn0sImlhdCI6MTY0NTUxMjEzM30.e5-LiMpGjWHW_PpiqJAXvLvCpmN6y3ZMF28LTB8JHEo"
          },
        });
        const json=response.json();
        console.log(json)
        console.log("deleting new note")
        const newNotes=notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)

      }
      //edit a note
      const editnote=async (id,title,description,tag)=>{
        // API CALL LOGIC TO edit IN  CLIENT
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method:'PUT',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIxMzcyMGE2MDU2MjE5YmRlMGM0M2QwIn0sImlhdCI6MTY0NTUxMjEzM30.e5-LiMpGjWHW_PpiqJAXvLvCpmN6y3ZMF28LTB8JHEo"
          },
          body: JSON.stringify({title,description,tag}) // body data type must match "Content-Type" header
        });
        const json= await response.json();
        console.log(json)
        //parsing to get a deep copy 
        let newNotes=JSON.parse(JSON.stringify(notes))
      
        for(let index=0;index<newNotes.length;index++)
        {
          const element=newNotes[index];
          if(element._id===id)
          {
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tag=tag
            break;
          }
          
        }
        setNotes(newNotes)

      }
   
    return(
        <NoteContext.Provider value={{notes,addnote,deletenote,editnote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState