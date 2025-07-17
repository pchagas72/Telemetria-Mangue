import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Replay from "./pages/Replay";
import { ReplayProvider } from "./context/ReplayContext";

function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>Dashboard</Link>
        <Link to="/replay">Replay</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/replay"
          element={
            <ReplayProvider>
              <Replay />
            </ReplayProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

