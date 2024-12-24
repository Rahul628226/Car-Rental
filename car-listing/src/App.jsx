import React, { useState } from "react";

import { ThemeProvider } from "styled-components";
import Routes from "./Routes";
import { GlobalStyle } from "./Components/Styles/globalStyles";
import { darkTheme, lightTheme } from "./Components/Styles/theme";
import Layout from "./Components/Layout/Layout";
import './index.css'
export const ThemeContext = React.createContext(null);

const App = () => {
    const [theme, setTheme] = useState("light");
    const themeStyle = theme === "light" ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeStyle}>
                <GlobalStyle />
              
                <>
                    <Layout>
                        <Routes />
                    </Layout>
                </>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default App;