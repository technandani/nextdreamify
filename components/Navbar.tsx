// src/Navbar.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth(); 
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="navLeft">
        <Link href="/">
          <h1 className="logo font-bold">Dreamify</h1>
        </Link>
      </div>
      <div className="navRight">
        <div className="responsiveMenu" onClick={toggleMenu}>
          <img src="images/menu.png" alt="menu" height={"22px"} />
        </div>
        <div className={`btns ${menuOpen ? "active" : ""}`}>
          <Link
            href="#"
            id="cutMenu"
            onClick={toggleMenu}
            style={{ display: menuOpen ? "block" : "none" }}
          >
            <img src="images/cut.png" alt="close menu" height={"30px"} />
          </Link>
            <Link className="btn px-4 py-2 cursor-pointer text-white rounded-lg flex justify-center items-center " id="genBtn" href="/create">
              {/* <i className="fa-solid fa-palette" style={{ color: "#fff" }}></i>{" "} */}
              {/* <i class="fa-solid fa-palette"></i> */}
              <img src="images/paint5.png" className="rounded-lg h-[30px] w-auto rotate-[315deg]" alt="" />
              Generate image
            </Link>
          {isLoggedIn ? (
            <button className="btn px-4 py-2 cursor-pointer text-white flex gap-2 bg-[#253b50] rounded-lg hover:bg-[#384d60]" onClick={logout}>
              <LogOut/>
              Logout
            </button>
          ) : (
              <Link href="/login" className="btn px-4 py-2 cursor-pointer text-white flex gap-2 bg-[#253b50] rounded-lg hover:bg-[#384d60]">
                <UserRound />
                SignIn / Login
              </Link> 
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;