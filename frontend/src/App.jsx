import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AlterStack from "./pages/AlterStack";
import Homepage from "./pages/HomePage";
import QueueStacks from "./pages/QueueStacks";
import BSTree from "./pages/BSTree";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/alter-stack" element={<AlterStack />} />
        <Route path="/queue-stacks" element={<QueueStacks/>} />
        <Route path='/bstree' element={<BSTree/>}/>
        {/* More routes to be added for further games */}
      </Routes>
    </Router>
  );
};

export default App;