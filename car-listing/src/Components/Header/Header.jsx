import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch, FaAdjust, FaBars, FaUser, FaHeart, FaBell, FaTimes } from "react-icons/fa"; // Import FaTimes
import { ThemeContext } from "./../../App";
import { FaFilter } from "react-icons/fa";
import CarDetailsFilterSection from "../carDetails/cardetailsFilter";
import RightSidebar from "../Common/RightSidebar";
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorInfo } from "../../Redux/Slicer/Vendor/VendorReg/VendorReg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Header = ({ handleOpen, handleClose }) => {
  const [menuOpen, setMenuOpen] = useState(false); // State to toggle menu
  const theme = useContext(ThemeContext);
  let message=''
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState("default");
  const { vendor, loading } = useSelector((state) => state.vendor);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle the menu open/close
  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
    if (menuOpen) {
      handleClose(); // Call handleClose when closing the menu
    } else {
      handleOpen(); // Call handleOpen when opening the menu
    }
  };


  useEffect(() => {
    const vendorId = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    if (vendorId && token && !vendor) {
      dispatch(fetchVendorInfo(vendorId)).then(() => {

      });
    }
    message = vendor?.firstname || vendor?.email
    if (message) {
      toast.success(`Welcome Back ${message}`);
    }
  }, [dispatch, vendor]);



  return (
    <><HeaderContainer>

      <TopBar>
        <MenuIcon>
          {menuOpen ? (
            <FaTimes onClick={toggleMenu} /> // Show FaTimes when menu is open
          ) : (
            <FaBars onClick={toggleMenu} /> // Show FaBars when menu is closed
          )}
        </MenuIcon>
        <ProfileIcon>
          <FaUser />
        </ProfileIcon>
      </TopBar>

      {/* Mobile Logo */}
      <MobileLogo>MOR<span></span>ENT</MobileLogo>

      {/* Mobile Search Section */}
      <MobileSearchContainer>


        <CarDetailsFilterSection />

      </MobileSearchContainer>

      {/* Desktop Layout */}
      <DesktopLayout>
        <Logo>MOR<span></span>ENT</Logo>
        <SearchBarDesktop>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput type="text" placeholder="Search something here" />
          <FilterIcon>
            <FaFilter />
          </FilterIcon>
        </SearchBarDesktop>
        <Actions>
          <ActionIcon>
            <FaHeart onClick={() => { setSidebarContent("wishlist"); toggleSidebar(); }} />
          </ActionIcon>
          <ActionIcon>
            <FaBell onClick={() => { setSidebarContent("settings"); toggleSidebar(); }} />
          </ActionIcon>
          <ActionIcon>
            <FaUser onClick={() => { setSidebarContent("profile"); toggleSidebar(); }} />
          </ActionIcon>
        </Actions>
      </DesktopLayout>
    </HeaderContainer><RightSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        content={sidebarContent}
        message={vendor}
      /></>
  );
};




const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
//   align-items: center;
  background-color: ${(props) => props.theme.bg};
  color: ${(props) => props.theme.text};
  padding: 2rem 1rem;
  gap:5px;
  border-bottom: 1px solid ${(props) => props.theme.bg3};
  box-shadow: 0px 4px 6px ${(props) => props.theme.bgAlpha};

  @media (min-width: 900px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 3.5rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;

  @media (min-width: 900px) {
    display: none;
  }
`;

const MenuIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.text};
`;

const ProfileIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  color: ${(props) => props.theme.text};
`;

const MobileLogo = styled.div`
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.primary};
  margin: 0.5rem 0;
  text-align: left; /* Ensures the text aligns to the left */

  @media (min-width: 900px) {
    display: none;
  }
`;


const MobileSearchContainer = styled.div`

  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;

  @media (min-width: 900px) {
    display: none;
  }
`;

const SearchBarMobile = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.bg2};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: 75%;
  box-shadow: 0px 2px 4px ${(props) => props.theme.bgAlpha};
`;

const SearchIcon = styled.div`
  margin-right: 0.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  color: ${(props) => props.theme.text};
  font-size: 1rem;

  @media (max-width: 900px) {
    font-size: 0.9rem;
  }
`;

const FilterButton = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  padding: 0 0.5rem;
  justify-content: space-between;
 
`;

const DesktopLayout = styled.div`
  display: none;

  @media (min-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.primary};
`;

const SearchBarDesktop = styled.div`
  display: flex;
  align-items: center;
  background-color: ${(props) => props.theme.bg2};
  border-radius: 20px;
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 500px;
  margin: 0 1rem;
  box-shadow: 0px 2px 4px ${(props) => props.theme.bgAlpha};
`;

const FilterIcon = styled.div`
  margin-left: 0.5rem;
  font-size: 1.2rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const ActionIcon = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

export default Header;