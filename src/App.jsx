import './App.css';
import { HashRouter, Route, Routes } from 'react-router';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import AboutMe from './components/AboutMe';
import PapersPage from './components/PapersPage';
import VisualizationPage from './components/VisualizationPage';

function App() {
  return (
    <HashRouter>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/papers" element={<PapersPage />} />
        <Route path="/visualization" element={<VisualizationPage />} />
        <Route path="/about" element={<AboutMe />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
