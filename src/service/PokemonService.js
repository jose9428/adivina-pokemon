import axios from "axios";
import { UrlAPIPOkemon } from "../utils/Constantes";

class PokemonService{
    url = UrlAPIPOkemon+'?offset=0&limit=800';
    
    async listarPokemones() {
        const response = await axios.get(this.url);
        return response.data;
    }
}

export default new PokemonService();