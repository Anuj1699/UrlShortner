import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./component/PrivateRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <div className="bg-amber-400 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
