import Sidebar from "./Sidebar";
import "../index.css";

function Home() {
  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <h1>Welcome!</h1>
        <p>This is your main content area beside the sidebar.</p>
      </div>
    </div>
  );
}

export default Home;
