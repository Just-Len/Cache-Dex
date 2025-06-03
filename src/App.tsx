import { TabList, TabPanel, Tabs } from "react-tabs"
import { IconTab } from "./components/Home/icon-tab";
import "react-tabs/style/react-tabs.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pokedex } from "./components/Pokedex/Pokedex";
import { Favorites } from "./components/favorites";
import { PokemonStats } from "./components/PokemonStats/PokemonStats";
import { STRINGS } from "./strings";
import { useEffect, useState } from "react";

import "./App.css"
import { useRefresh } from "./util";

export default function App()
{
	const refresh = useRefresh();

	useEffect(() => {
		window.onlanguagechange = (_: Event) => {
			STRINGS.setLanguage(navigator.language);
			refresh();
		};

		return () => { window.onlanguagechange = null };
	}, []);

	return (
		<Tabs className="tabs-container container-fluid bg-dark text-light">
			<TabList style={{ textAlign: "center" }}>
				<IconTab iconUrl="image/pokedex.png" title={STRINGS.pokedex}/>
				<IconTab iconUrl="image/pokemon-shiny.png" title={STRINGS.favorites}/>
				<IconTab iconUrl="image/floppy-disk.png" title={STRINGS.cachedex}/>
			</TabList>

			<TabPanel>
				<Pokedex/>
			</TabPanel>
			<TabPanel>
				<Favorites/>
			</TabPanel>
			<TabPanel>
				<PokemonStats/>
			</TabPanel>
		</Tabs>
	);
}
