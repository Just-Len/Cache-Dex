import { useState } from 'react'
import { TabList, TabPanel, Tabs } from 'react-tabs'

import { IconTab } from './components/icon-tab';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'react-tabs/style/react-tabs.css';
import './App.css'

export default function App()
{
	const [count, setCount] = useState(0)

	return (
		<Tabs className="tabs-container">
			<TabList style={{ textAlign: "center" }}>
				<IconTab iconUrl="https://cdn-icons-png.flaticon.com/512/188/188940.png" title="Pokédex"/>
				<IconTab iconUrl="https://res.cloudinary.com/shiny24/image/upload/v1669396824/pokemon/shiny_symbol_pokemon_tdxjdc.png"
						 title="Favoritos"/>
				<IconTab iconUrl="https://www.freeiconspng.com/uploads/floppy-save-icon--23.png" title="Cachédex"/>
			</TabList>

			<TabPanel>
				<div className="center-container">
					<div style={{ textAlign: "center" }}>
						<a href="https://vite.dev" target="_blank">
							<img src={viteLogo} className="logo" alt="Vite logo" />
						</a>
						<a href="https://react.dev" target="_blank">
							<img src={reactLogo} className="logo react" alt="React logo" />
						</a>
						<h1>Vite + React</h1>
						<div className="card">
							<button onClick={() => setCount((count) => count + 1)}>
								count is {count}
							</button>
							<p>
								Edit <code>src/App.tsx</code> and save to test HMR
							</p>
						</div>
						<p className="read-the-docs">
							Click on the Vite and React logos to learn more
						</p>
					</div>
				</div>
			</TabPanel>

			<TabPanel>
				<h1>Todavía nada por aquí</h1>
			</TabPanel>

			<TabPanel>
				<h1>Todavía nada por aquí</h1>
			</TabPanel>
		</Tabs>
	)
}
