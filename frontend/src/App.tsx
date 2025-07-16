// src/App.tsx
import Dashboard from "./pages/Dashboard";
import Replay from "./pages/Replay";
import { ReplayProvider } from "./context//ReplayContext.tsx"
import "./App.css"

function App() {
    return(
        <ReplayProvider>
            <Replay />
        </ReplayProvider>
    )

}

export default App;
