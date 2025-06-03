import { useState } from "react";

export function useRefresh()
{
	const [_, setFoo] = useState(0);

	return () => setFoo(current => current + 1);
}
