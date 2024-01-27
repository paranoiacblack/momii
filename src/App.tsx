import iteminfo from 'bundle-text:../static/iteminfo.lua';
import {Item, parseItems} from './lib/item_parser';
import { ExactWordIndexStrategy, Search } from 'js-search';
import ItemTable from './components/ItemTable';
import { Box, CssBaseline, CssVarsProvider } from '@mui/joy';
import React = require('react');
import { useColorScheme } from '@mui/joy';
import Button from '@mui/joy/Button';
import { DarkModeRounded, LightMode } from '@mui/icons-material';

const customItems: Item[] = parseItems(iteminfo)
var search = new Search('id')
search.indexStrategy = new ExactWordIndexStrategy()
search.addIndex('name')
search.addIndex('description')
search.addDocuments(customItems)

function ModeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);
  
    // necessary for server-side rendering
    // because mode is undefined on the server
    React.useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return <Button variant="soft">Change mode</Button>;
    }
  
    return (
      <Button
        variant="soft"
        onClick={() => {
          setMode(mode === 'light' ? 'dark' : 'light');
        }}
      >
        {mode === 'light' ? <DarkModeRounded /> : <LightMode /> }
      </Button>
    );
}   

export default function App() {
    return (
        <CssVarsProvider>
          <CssBaseline />
          <ModeToggle />
          <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Box
              component="main"
              className="MainContent"
              sx={{
                px: { xs: 2, md: 6 },
                pt: {
                  xs: 'calc(12px + var(--Header-height))',
                  sm: 'calc(12px + var(--Header-height))',
                  md: 3,
                },
                pb: { xs: 2, sm: 2, md: 3 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                height: '100dvh',
                gap: 1,
              }}
            >
              <ItemTable items={[customItems[0]]} />
            </Box>
          </Box>
        </CssVarsProvider>
    );
}