import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import About from './components/About';
import Navbar from './components/Navbar';
import { Home } from './components/Home';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';



function App() {
  return (
    <div>
      <NoteState>
        <Router>
          <Navbar />
          <Alert message="your are doing amazing job"/>
          <div className="container">
            <Routes>
              <Route exact path="/About" element={<About />} />
              <Route exact path="/" element={<Home/>} />
              <Route exact path="/Login" element={<Login/>}/>
              <Route exact path="/Signup" element={<Signup/>}/>
             

            </Routes>
          </div>
        </Router>
      </NoteState>

    </div>


  );
}

export default App;
