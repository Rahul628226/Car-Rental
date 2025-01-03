import React, { useEffect } from "react";
import styled from "styled-components";

const SidebarWrapper = styled.div`
  position: fixed;
  top: 0;
  right: ${({ isOpen }) => (isOpen ? "0" : "-300px")};
  height: 100%;
  width: 300px;
  background-color:  ${({ theme }) => theme.bg2};
   color: ${({ theme }) => theme.text};
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  transition: right 0.3s ease;
  z-index: 1001;

  @media (max-width: 768px) {
    width: 200px;
    right: ${({ isOpen }) => (isOpen ? "0" : "-200px")};
  }
`;

const SidebarContent = styled.div`
  padding: 20px;
`;

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const RightSidebar = ({ isOpen, toggleSidebar, content,message }) => {
  const renderContent = () => {
    switch (content) {
      case "wishlist":
        return <div>Your Wishlist Items</div>;
      case "profile":
        return <div>
          {message?.firstname || message?.email}
        </div>;
      case "settings":
        return <div>App Settings</div>;
      default:
        return <div>Default Sidebar Content</div>;
    }
  };

  const handleOutsideClick = (e) => {
    if (isOpen && e.target.id === "overlay") {
      toggleSidebar();
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <Overlay id="overlay" isOpen={isOpen} onClick={handleOutsideClick} />
      <SidebarWrapper isOpen={isOpen}>
        <SidebarContent>{renderContent()}</SidebarContent>
      </SidebarWrapper>
    </>
  );
};

export default RightSidebar;
