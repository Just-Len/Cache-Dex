import { TabList, TabPanel, Tabs } from "react-tabs"

import { IconTab } from "./components/Home/icon-tab";
import "react-tabs/style/react-tabs.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import { Pokedex } from "./components/Pokedex";
import { Favorites } from "./components/favorites";

export default function App()
{
	return (
		<Tabs className="tabs-container container-fluid bg-dark text-light">
			<TabList style={{ textAlign: "center" }}>
				<IconTab iconUrl="image/pokedex.png" title="Pokédex"/>
				<IconTab iconUrl="image/pokemon-shiny.png" title="Favoritos"/>
				<IconTab iconUrl="image/floppy-disk.png" title="Cachédex"/>
			</TabList>

			<TabPanel>
				<Pokedex/>
			</TabPanel>
			<TabPanel>
				<Favorites/>
			</TabPanel>

			<TabPanel>
				<h1 style={{ textAlign: "center" }}>Todavía nada por aquí (Len)</h1>
			</TabPanel>
		</Tabs>
	);
}
