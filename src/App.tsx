import { TabList, TabPanel, Tabs } from "react-tabs"

import { IconTab } from "./components/icon-tab";
import "react-tabs/style/react-tabs.css";
import { ApiClient } from "./services/api-client";
import "./App.css"
import { useEffect } from "react";

export default function App()
{
	useEffect(() => {
		new ApiClient().pokemon().then(data => console.log("Pokemon: ", data));
		new ApiClient().pokemonSpecies().then(data => console.log("Species: ", data));
		new ApiClient().pokemonTypes().then(data => console.log("Types: ", data));
		new ApiClient().moves().then(data => console.log("Moves: ", data));
	}, []);
	return (
		<Tabs className="tabs-container">
			<TabList style={{ textAlign: "center" }}>
				<IconTab iconUrl="image/pokedex.png" title="Pokédex"/>
				<IconTab iconUrl="image/pokemon-shiny.png" title="Favoritos"/>
				<IconTab iconUrl="image/floppy-disk.png" title="Cachédex"/>
			</TabList>

			<TabPanel>
				<h1 style={{ textAlign: "center" }}>Todavía nada por aquí (Alvarado)</h1>
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
