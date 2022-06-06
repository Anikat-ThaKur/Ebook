const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Route:1 create a user using Get "/api/auth/createuset". require Login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });

        res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred")
    }
   
})

//Route:2 add a new note using post:"api/auth/addnote",Login required
router.post('/addnote', fetchuser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
    const errors = validationResult(req);
    //check if there is error
    if (!errors.isEmpty()) {
        //if error send error 404 and send error arrays
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title, description, tag, user: req.user.id

    })
    const savedNote=await note.save();
    res.json(savedNote)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred")
    }
})

//Route:3 update  a  note using post:"api/auth/updatenote",Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const {title,description,tag}=req.body;
    //Create a newNote object
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag}
    //find a note to be updated and update it

    //check if note exist eith this id
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    //if the user id and the id we get from updatenote is not same then dont allow it to update
    if(note.user.toString() !==req.user.id){
        return res.status(400).send("not Allowed")
    }

    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json(note);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred")
        
    }
    
})

//Route:4 delete  a  note using post:"api/auth/deletenote",Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
    //Create a newNote object
   
    //find a note to be updated and update it

    //find the note to be deleted and delete it
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    //if the user id and the id we get from updatenote is not same then dont allow it to update
    if(note.user.toString() !==req.user.id){
        return res.status(401).send("not Allowed")
    }

    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note:note});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error occurred")
        
    }

    
})


module.exports = router 