import iteminfo from 'bundle-text:../static/iteminfo.lua';
import {Item, parseItems} from './lib/item_parser';
import { ExactWordIndexStrategy, Search } from 'js-search';
import ItemTable from './components/ItemTable';
import { CssVarsProvider } from '@mui/joy';
import Sheet from '@mui/joy/Sheet';
import React = require('react');
import { useColorScheme } from '@mui/joy';
import Button from '@mui/joy/Button';

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
        {mode === 'light' ? 'Turn dark' : 'Turn light'}
      </Button>
    );
}   

export default function App() {
    return (
        <CssVarsProvider>
            <ModeToggle />
            <Sheet
                sx={{
                    width: '50%',
                    mx: 'auto', // margin left & right
                    my: 4, // margin top & bottom
                    py: 3, // padding top & bottom
                    px: 2, // padding left & right
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    borderRadius: 'sm',
                    boxShadow: 'md',
                    }}                   
                variant="outlined">
                <ItemTable items={customItems} />
            </Sheet>
        </CssVarsProvider>
    );
}