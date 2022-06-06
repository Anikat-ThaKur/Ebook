import React, { useState } from 'react'
import  { useContext } from 'react'
import noteContext from '../context/notes/noteContext';
const Addnote = () => {
    const context = useContext(noteContext);
    const { addnote } = context;
    const [note,setNote]=useState({title: "",description: "",tag: "default"})
    const handleClick=(e)=>{
        e.preventDefault()
           addnote(note.title,note.description,note.tag)
           //after adding note the i dont get option to add agin that same
           setNote({title: "",description: "",tag: ""})
    }
    const onChange=(e)=>{
      setNote({...note,[e.target.name]:e.target.value})
    }
  return (
    <div>
          <div className="container my-3">
        <h2>Add Note</h2>
        <div className="container my-3">
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title"  name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required />
            
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">Tag</label>
            <input type="text" className="form-control" value={note.tag} id="tag" name="tag" onChange={onChange} />
          </div>
          <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary"  onClick={handleClick}>ADD NOTE</button>
        </form>
        </div>

      </div>
    </div>
  )
}

export default Addnote