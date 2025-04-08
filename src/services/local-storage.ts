export class LocalStorageService {
    public async getPokemons() {
        const pokemons = { ...localStorage }
        return pokemons;
    }

    public async setPokemon(id: number){
        try{
            localStorage.setItem(`pokemon-${id}`, JSON.stringify(id));
            return 0;
        }catch (error) {
            console.error("Error saving pokemon to local storage", error);
            return -1;
        }
    }
}