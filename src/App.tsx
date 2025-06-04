import { TabList, TabPanel, Tabs } from "react-tabs"
import { IconTab } from "./components/Home/icon-tab";
import "react-tabs/style/react-tabs.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pokedex } from "./components/Pokedex/Pokedex";
import { Favorites } from "./components/Favorites";
import { PokemonStats } from "./components/PokemonStats/PokemonStats";
import { STRINGS } from "./strings";
import { useEffect, useState } from "react";
import "./App.css"
import { useRefresh } from "./util";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function App()
{
	const refresh = useRefresh();
	const [darkMode, setDarkMode] = useState<boolean>(false);

	useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setDarkMode(savedTheme === "dark");
  	}, []);

	useEffect(() => {
  		if (darkMode) {
    	document.body.classList.add("dark");
    	document.body.classList.remove("light");
  		} else {
    	document.body.classList.add("light");
    	document.body.classList.remove("dark");
  	}
	
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

	useEffect(() => {
		window.onlanguagechange = () => {
			STRINGS.setLanguage(navigator.language);
			refresh();
		};

		return () => { window.onlanguagechange = null };
	}, []);

	return (
		<Tabs className="tabs-container container-fluid bg-dark text-light">
  			<TabList style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    			<div style={{ display: "flex", gap: "1rem" }}>
      				<IconTab iconUrl="image/pokedex.png" title={STRINGS.pokedex} />
      				<IconTab iconUrl="image/pokemon-shiny.png" title={STRINGS.favorites} />
      				<IconTab iconUrl="image/floppy-disk.png" title={STRINGS.cachedex} />
    			</div>

    			<div className="switch-container" style={{ marginLeft: "auto" }}>
      				<input
        				type="checkbox"
        				id="switch"
        				checked={darkMode}
        				onChange={() => setDarkMode((prev) => !prev)}
      				/>
      				<label htmlFor="switch">
        				<i className="fas fa-sun"></i>
        				<i className="fas fa-moon"></i>
        				<span className="ball"></span>
      				</label>
    			</div>
  			</TabList>

  <TabPanel>
    <Pokedex />
  </TabPanel>
  <TabPanel>
    <Favorites/>
  </TabPanel>
  <TabPanel>
    <PokemonStats />
  </TabPanel>
</Tabs>

	);
}
