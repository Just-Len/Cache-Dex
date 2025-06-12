import { ReactTabsFunctionComponent, Tab, TabProps } from "react-tabs";

import "./icon-tab.css"

interface IconTabData extends TabProps
{
	iconUrl: string;
	title: string;
}

export const IconTab: ReactTabsFunctionComponent<IconTabData> = ({iconUrl: imageUrl, title, ...other}) =>
{
	const tabId = `tab-${title}`;
	return (
		<Tab className="icon-tab" selectedClassName="icon-tab-selected" {...other}>
			<img aria-labelledby={tabId} className="icon-tab-image" src={imageUrl}/>
			<div id={tabId}>{ title }</div>
		</Tab>
	);
}

IconTab.tabsRole = "Tab";
