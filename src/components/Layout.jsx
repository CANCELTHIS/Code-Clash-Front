import { useAuth } from "../hooks/useAuth.jsx";
import { Link } from "react-router-dom";
import { MdOutlineToken } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { FiCodesandbox } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-secondary">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-secondary p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-accent transition-colors"
          >
            <FiCodesandbox size={42} />
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="bg-slate-300 text-black px-3 py-1 rounded-full font-bold flex items-center">
                {user.username}
              </span>
              <div className=" bg-slate-200 text-black px-3 py-1 rounded-full font-bold flex items-center">
                <MdOutlineToken /> {user.tokens || 0}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
                className="cursor-pointer text-center"
                onClick={logout}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Logout"
              >
                <FiLogOut size={24} />
                <Tooltip
                  id="my-tooltip"
                  className="!bg-gray-900 !text-white !rounded-lg !px-4 !py-2 !shadow-lg"
                  place="bottom"
                  effect="solid"
                />
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
