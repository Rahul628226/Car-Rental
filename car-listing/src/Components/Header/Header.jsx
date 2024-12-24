import React, { useContext } from "react";
import styled from "styled-components";
import { FaSearch, FaAdjust, FaBars, FaUser, FaHeart, FaBell } from "react-icons/fa";
import { ThemeContext } from "./../../App";
import { FaFilter } from "react-icons/fa";
const Header = () => {
  const theme = useContext(ThemeContext);

  return (
    <HeaderContainer>
      {/* Mobile Top Bar */}
      <TopBar>
        <MenuIcon>
          <FaBars />
        </MenuIcon>
        <ProfileIcon>
          <FaUser />
        </ProfileIcon>
      </TopBar>

      {/* Mobile Logo */}
      <MobileLogo>MOR<span></span>ENT</MobileLogo>

      {/* Mobile Search Section */}
      <MobileSearchContainer>
        <SearchBarMobile>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput type="text" placeholder="Search something here" />
        </SearchBarMobile>
        <FilterButton>
          <FaFilter />
        </FilterButton>
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
            <FaHeart />
          </ActionIcon>
          <ActionIcon>
            <FaBell />
          </ActionIcon>
          <ActionIcon>
            <FaUser />
          </ActionIcon>
        </Actions>
      </DesktopLayout>
    </HeaderContainer>
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
  display: flex;
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
