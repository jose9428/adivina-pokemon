import { useEffect, useState } from "react";
import PokemonService from "../service/PokemonService";
import { UrlIMGPokemon } from "../utils/Constantes";
import { Alert, Box, Button, Grid, Snackbar } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import tituloIMG from "../assets/pokemon.png";

export default function AdivinaPokemon() {
  const [pokemones, setPokemones] = useState([]);
  const [randomPokemon, setRandomPokemon] = useState([]);
  const [pokemon, setPokemon] = useState({});
  const [seleccion, setSeleccion] = useState(null);
  const [open, setOpen] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [perdio, setPerdio] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [score, setScore] = useState(0);
  const tiempo = 3000;

  const fnListarPokemones = async () => {
    const data = await PokemonService.listarPokemones();
    setPokemones(data.results);
    fnGenerarPokemon(data.results);
  };

  const fnRandom = (max) => {
    return Math.floor(Math.random() * max);
  };

  const fnGenerarPokemon = (data) => { 
    let max = data.length;
    let array = [];
    let indice = 0;
    let maxPok = 4;
    let indexPok;

    do {
      indexPok = fnRandom(max);

      if (array.filter((x) => x.name == data[indexPok].name).length == 0) {
        let item = data[indexPok];
        item.id = item.url.split('/')[6];
        array[indice] = item;
        indice++;
      }
    } while (indice < maxPok);

    indexPok = fnRandom(array.length);
    setPokemon(array[indexPok]);
    setRandomPokemon(array);
    setSeleccion(null); 
    setScore(fnRecuperarScore());
  };

  const fnNuevaPartida = () => {
    setPerdio(false);
    setPuntaje(0);
    fnGenerarPokemon(pokemones);
  };

  const fnRecuperarScore = () =>{
    if(localStorage.getItem('score') != null){
        return parseInt(localStorage.getItem('score'));
    }
    return 0;
  }

  const fnGuardarScore = () =>{
    if(puntaje > score){
        localStorage.setItem('score' , puntaje);
    }
  }

  const fnEscoger = (item) =>{
    setOpen(true);

    if(item.name == pokemon.name){
        setTipoAlerta('success');
        setMensaje('Correcto el pokemon fue '+ pokemon.name);
        setPuntaje(puntaje + 10);

        setTimeout(() => { 
            fnGenerarPokemon(pokemones)
        }, (tiempo));
    }else{
        setTipoAlerta('error');
        setMensaje('Perdiste el pokemon fue '+ pokemon.name+" :(");
        setPerdio(true);
        fnGuardarScore();
    }
    setSeleccion(item);
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fnListarPokemones();
  }, []);

  return (
    <>

    <Snackbar open={open} autoHideDuration={tiempo} onClose={handleClose}>
      <Alert onClose={handleClose} severity={tipoAlerta} sx={{ width: '100%' }}>
          {mensaje}
      </Alert>
    </Snackbar>

      <Grid container style={{ textAlign: "center" }} className="puntuacion">
        <Grid container justifyContent="center">
            <img src={tituloIMG} className="titulo-pokemon" />
        </Grid>

        <Grid item xs={6} md={6}>
          <h1>Score: {score}</h1>
        </Grid>
        <Grid item xs={6} md={6}>
          <h1>Puntaje: {puntaje}</h1>
        </Grid>

      </Grid>

      <Grid container justifyContent="center">
        <Grid item xs={6} md={6}>
          <Box p={2}>
            {pokemon.id != undefined && (
              <img
                src={UrlIMGPokemon + pokemon.id + ".png"}
                className={seleccion == null ? 'pokemon-dark': ''} 
                style={{ height: "auto" }}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
              <Button
                onClick={() => fnNuevaPartida()}
                color="primary"
                variant="contained"
                size="small"
                style={{ textAlign: "center" }}
                disabled={!perdio}
                startIcon={<AutorenewIcon />}
              >
                Nueva Partida
              </Button>

              {randomPokemon.map((item, index) => (
                <Button
                  key={index}
                  sx={{ p: 2 }}
                  className="buttonW"
                  variant="contained"
                  color="info"
                  style={{ marginTop: "5px" }}
                  disabled={perdio || seleccion}
                  onClick={ () => fnEscoger(item)}
                >
                  {item.name}
                </Button>
              ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
