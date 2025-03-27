import { TabList, TabPanel, Tabs } from "react-tabs"

import { IconTab } from "./components/icon-tab";
import "react-tabs/style/react-tabs.css";
import "./App.css"

export default function App()
{
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
