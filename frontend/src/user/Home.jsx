import Sidebar from "./Sidebar";
import "../index.css";
import { logout } from "./apiUser";

function Home() {
  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome!</h1>
        <p>This is your main content area beside the sidebar.</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
