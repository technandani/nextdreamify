import { MoveUp } from "lucide-react";
import React, { useState, useEffect } from "react";

// const ScrollToTopBtn = styled.div`
//   font-size: 30px;
//   height: 50px;
//   width: 50px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   border-radius: 50%;
//   background-color: transparent;
//   box-shadow: #fff 0 0 5px;

//   @media (max-width: 639px) {
//     font-size: 22px;
//     height: 40px;
//     width: 40px;
//   }
// `;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show or hide the button depending on the scroll position
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "1",
        backgroundColor: "transparent",
      }}
    >
      {isVisible && (
        <div onClick={scrollToTop} style={{"fontSize": "30px", "height": "50px", "width": "50px", "display": "flex", "alignItems": "center", "justifyContent": "center", "borderRadius": "50%", "backgroundColor": "#0c1821", "boxShadow": "#fff 0 0 5px", "cursor": "pointer"}}>
          <MoveUp />
        </div>
      )}
    </div>
  );
};

export default ScrollToTop;
