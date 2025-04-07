import { TabList, TabPanel, Tabs } from "react-tabs"

import { IconTab } from "./components/Home/icon-tab";
import "react-tabs/style/react-tabs.css";
import { ApiClient } from "./services/api-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"
import { useEffect } from "react";
import { Pokedex } from "./components/Pokedex";

export default function App()
{
	useEffect(() => {
		new ApiClient().pokemon().then(data => console.log("Pokemon: ", data));
		new ApiClient().pokemonSpecies().then(data => console.log("Species: ", data));
		new ApiClient().pokemonTypes().then(data => console.log("Types: ", data));
		new ApiClient().moves().then(data => console.log("Moves: ", data));
	}, []);
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
				<h1 style={{ textAlign: "center" }}>Todavía nada por aquí (Coco)</h1>
			</TabPanel>

			<TabPanel>
				<h1 style={{ textAlign: "center" }}>Todavía nada por aquí (Len)</h1>
			</TabPanel>
		</Tabs>
	);
}
