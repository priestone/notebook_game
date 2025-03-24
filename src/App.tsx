import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { RewardsProvider } from "./context/RewardsContext";
import StartScreen from "./components/StartScreen";
import Page1 from "./components/Page1";
import Page2 from "./components/Page2";
import Page3 from "./components/Page3";
import Page4 from "./components/Page4";
import Page5 from "./components/Page5";
import Ending from "./components/Ending";
import PageNotFound from "./components/PageNotFound";
import "./App.css";

function App() {
  return (
    <RewardsProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<StartScreen />} />
            <Route path="/page1" element={<Page1 />} />
            <Route path="/page2" element={<Page2 />} />
            <Route path="/page3" element={<Page3 />} />
            <Route path="/page4" element={<Page4 />} />
            <Route path="/page5" element={<Page5 />} />
            <Route path="/ending" element={<Ending />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </Router>
    </RewardsProvider>
  );
}

export default App;
