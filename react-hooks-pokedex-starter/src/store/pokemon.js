import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';

const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';

const load = list => ({
  type: LOAD,
  list,
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types,
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon,
});

export const getPokemonDetails = (id) => async dispatch => {
  const res = await fetch(`/api/pokemon/${id}`);
  if (res.ok) {
    const pokemon = await res.json();
    dispatch(addOnePokemon(pokemon));
  }
}

export const createPokemon = (pokemon) => async dispatch => {
  const { no, attack, defense, imageUrl, name, type, moves } = pokemon;
  const res = await fetch(`/api/pokemon`, {
    method: 'POST',
    body: JSON.stringify({
      no, attack, defense, imageUrl, name, type, moves
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
  const newPokemon = await res.json();
  console.log(newPokemon);
  dispatch(addOnePokemon(newPokemon));
  return newPokemon;
}

export const editPokemon = (pokemon, id) => async dispatch => {
  const { no, attack, defense, imageUrl, name, type, moves } = pokemon;
  const res = await fetch(`/api/pokemon/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id, no, attack, defense, imageUrl, name, type, moves
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
  const editedPokemon = await res.json();
  dispatch(addOnePokemon(editedPokemon));
  return editedPokemon;
}

export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

const initialState = {
  list: [],
  types: []
};

const sortList = (list) => {
  return list.sort((pokemonA, pokemonB) => {
    return pokemonA.no - pokemonB.no;
  }).map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD: {
      const allPokemon = {};
      action.list.forEach(pokemon => {
        allPokemon[pokemon.id] = pokemon;
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list),
      };
    }
    case LOAD_TYPES: {
      return {
        ...state,
        types: action.types,
      };
    }
    case ADD_ONE: {
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: action.pokemon
        };
        const pokemonList = newState.list.map(id => newState[id]);
        pokemonList.push(action.pokemon);
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...action.pokemon,
        }
      };
    }
    case LOAD_ITEMS: {
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map(item => item.id),
        }
      };
    }
    case REMOVE_ITEM: {
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].filter(
            (item) => item.id !== action.itemId
          ),
        },
      };
    }
    case ADD_ITEM: {
      console.log(action.item);
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId], action.item.id],
        },
      };
    }
    default:
      return state;
  }
}

export default pokemonReducer;
