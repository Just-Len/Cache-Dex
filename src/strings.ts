import LocalizedStrings from "localized-strings";

export interface Strings extends LocalizedStrings
{
	addFavorite: string;
	cachedex: string;
	favorites: string;
	id: string;
	loading: string;
	search: string;
	pokedex: string;
	removeFavorite: string;
	stats: string;
	type: string;
}

export const STRINGS: Strings = new LocalizedStrings({
	en: {
		addFavorite: "Add to favorites",
		cachedex: "Cachedex",
		favorites: "Favorites",
		id: "ID",
		loading: "Loading",
		search: "Search",
		pokedex: "Pokedex",
		removeFavorite: "Remove from favorites",
		stats: "Stats",
		type: "Type"
	},
	es: {
		addFavorite: "Agregar a favoritos",
		cachedex: "Cachédex",
		favorites: "Favoritos",
		id: "ID",
		loading: "Cargando",
		search: "Buscar",
		pokedex: "Pokédex",
		removeFavorite: "Remover de favoritos",
		stats: "Estadísticas",
		type: "Tipo"
	},
	ja: {
		addFavorite: "お気に入りに追加",
		cachedex: "キャッシュデックス",
		favorites: "お気に入り",
		id: "ID",
		loading: "読み込み中",
		search: "検索",
		pokedex: "ポケモン図鑑",
		removeFavorite: "お気に入りから削除",
		stats: "統計",
		type: "タイプ"
	}
}) as Strings;
