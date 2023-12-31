import { Box } from '@mui/material'
import './App.css'
import AdivinaPokemon from './pages/AdivinaPokemon'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <>
     <Box style={{  padding: '10px', marginTop: '10px' }} >
        <AdivinaPokemon />
      </Box>
    </>
  )
}

export default App
