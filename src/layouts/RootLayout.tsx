import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
   
    </div>
     
  );
};

export default RootLayout;
