import LocalizedStrings from "localized-strings";

export interface Strings extends LocalizedStrings
{
	addFavorite: string;
	cachedex: string;
	favorites: string;
	id: string;
	loading: string;
	loadingImage: string;
	noPokemons: string;
	search: string;
	pokedex: string;
	removeFavorite: string;
	skipToMainContent: string;
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
		loadingImage: "Loading image",
		noPokemons: "We didn't found any pokemons",
		search: "Search",
		pokedex: "Pokedex",
		removeFavorite: "Remove from favorites",
		skipToMainContent: "Skip to main content",
		stats: "Stats",
		type: "Type"
	},
	es: {
		addFavorite: "Agregar a favoritos",
		cachedex: "Cachédex",
		favorites: "Favoritos",
		id: "ID",
		loading: "Cargando",
		loadingImage: "Cargando imagen",
		noPokemons: "No encontramos ningún pokémon",
		search: "Buscar",
		pokedex: "Pokédex",
		removeFavorite: "Remover de favoritos",
		skipToMainContent: "Saltar al contenido principal",
		stats: "Estadísticas",
		type: "Tipo"
	},
	ja: {
		addFavorite: "お気に入りに追加",
		cachedex: "キャッシュデックス",
		favorites: "お気に入り",
		id: "ID",
		loading: "読み込み中",
		loadingImage: "画像の読み込み",
		noPokemons: "ポケモンは見つかりませんでした",
		search: "検索",
		pokedex: "ポケモン図鑑",
		removeFavorite: "お気に入りから削除",
		skipToMainContent: "本文へスキップ",
		stats: "統計",
		type: "タイプ"
	}
}) as Strings;
