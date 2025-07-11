import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  // console.log("user", user);
  // console.log("email", user?.email);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="navLeft">
        <Link href="/" className="flex items-center space-x-2">
          <span className="lg:px-14 max-sm:px-4 px-4 sm:px-4 lg:text-4xl text-2xl font-extrabold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Dreamify
          </span>
        </Link>
      </div>
      <div className="navRight">
        <div className="responsiveMenu" onClick={toggleMenu}>
          <Image src="/images/menu.png" alt="menu" width={22} height={22} />
        </div>
        <div className={`btns ${menuOpen ? "active" : ""}`}>
          <Link
            href="#"
            id="cutMenu"
            onClick={toggleMenu}
            style={{ display: menuOpen ? "block" : "none" }}
          >
            <X size={40} className="text-white" />
          </Link>
          <Link
            className="btn px-4 py-2 cursor-pointer text-wh rounded-lg flex justify-center items-center gap-2"
            id="genBtn"
            href="/create"
          >
            <Image
              src="/images/paint5.png"
              alt="Paint stroke"
              width={24}
              height={24}
              className="rounded-lg w-auto rotate-[315deg]"
            />
            Generate image
          </Link>
          {user &&
          (user.email === "nks854338@gmail.com" ||
            user.email === "nitish@gmail.com") ? (
            <Link
              className="btn px-4 py-2 cursor-pointer text-wh rounded-lg flex justify-center items-center gap-2"
              id="genBtn"
              href="/all-images"
            >
              <Image
                src="/images/paint5.png"
                alt="Paint stroke"
                width={24}
                height={24}
                className="rounded-lg w-auto rotate-[315deg]"
              />
              All images
            </Link>
          ) : null}

          {isLoggedIn ? (
            <button
              className="btn px-4 py-2 cursor-pointer text-wh flex gap-2 justify-center items-center bg-[#253b50] rounded-lg hover:bg-[#384d60]"
              onClick={logout}
            >
              <LogOut />
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="btn px-4 py-2 cursor-pointer text-wh flex gap-2 bg-[#253b50] rounded-lg hover:bg-[#384d60]"
            >
              <User />
              SignUp / SignIn
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
