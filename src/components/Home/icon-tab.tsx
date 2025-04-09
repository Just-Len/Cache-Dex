import { ReactTabsFunctionComponent, Tab, TabProps } from "react-tabs";

import "./icon-tab.css"

interface IconTabData extends TabProps
{
	iconUrl: string;
	title: string;
}

export const IconTab: ReactTabsFunctionComponent<IconTabData> = ({iconUrl: imageUrl, title, ...other}) => (
	<Tab className="icon-tab" selectedClassName="icon-tab-selected" {...other}>
		<img className="icon-tab-image" src={imageUrl}/>
		{title}
	</Tab>
);

IconTab.tabsRole = "Tab";
