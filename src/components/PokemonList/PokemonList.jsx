import { useEffect, useState } from "react";
import axios from 'axios';

// import css
import './PokemonList.css'
import Pokemon from "../Pokemon/Pokemon";

function PokemonList(){

    const [pokemonList, setPokemonList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon';
    const [pokedexUrl, setPokedexUrl] = useState('https://pokeapi.co/api/v2/pokemon');

    const [nextUrl, setNextUrl] = useState('');
    const [prevUrl, setPrevUrl] = useState('');

    async function downloadPokemon(){
        setIsLoading(true);

        // get data from external api
        const response = await axios.get(pokedexUrl); // this downloads 20 pokemons
        console.log(response.data);
        setNextUrl(response.data.next);
        setPrevUrl(response.data.previous);
        

        const pokemonResults = response.data.results;   // get the array of pokemons from result
        
        // iterating over array of pokemons, and using their url to create array of promises
        // that will download those 20 pokemons
        const pokemonResultsPromise = pokemonResults.map((pokemon) => axios.get(pokemon.url));
        // console.log(pokemonResultsPromise);

        // passing array of promises to axios.all() and get detailed data fo those 20 pokemon
        const pokemonData = await axios.all(pokemonResultsPromise);
        
        // now iterate on data of each pokemon and extract their name, image_url, id, type
        const res = pokemonData.map((pokeData) =>{
            const pokemon = pokeData.data;
            return{
                id: pokemon.id,
                name : pokemon.name,
                image: pokemon.sprites.other.dream_world.front_default,
                types: pokemon.types,
            }
        })

        // console.log(res);
        setPokemonList(res);
        
    }


    useEffect(() => {       // take two arg 1-> callback, 2-> dependency array
            downloadPokemon();
            setIsLoading(false);
    },[pokedexUrl]);


    return(
        <div className="pokemon-list-wrapper">
           <h2>Pokemon List ...</h2>
           <div className="pokemon-wrapper">
                {isLoading ? 'Data Loading': 
                        pokemonList.map((p) => <Pokemon name={p.name} image={p.image} key={p.id} />)
                }
            </div>
            <div className="controls">
                <button disabled={prevUrl === null} onClick={() => setPokedexUrl(prevUrl)}>Prev</button>
                <button disabled={nextUrl === null} onClick={() => setPokedexUrl(nextUrl)}>Next</button>
            </div> 
        </div>
    )
}

export default PokemonList;