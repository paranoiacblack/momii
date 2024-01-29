import { Item, itemTypes, itemType } from '../lib/item_parser';
import React = require('react');
import { Table, Input, Sheet, Box, FormControl, FormLabel, Typography, Option, Select, Button } from '@mui/joy';
import { Search } from '@mui/icons-material';
import descriptionAsHTML from '../lib/item_description';
import { SmallImages, LargeImages } from '../lib/item_images';

interface TableProps {
    searchFn(query: string, type: string): Item[]
}

function ItemTable(props: TableProps) {
    const { searchFn } = props;
    const sortedItemTypes = Array.from(itemTypes);
    sortedItemTypes.sort();

    const [query, setQuery] = React.useState("");
    const [type, setType] = React.useState("");
    const [items, setItems] = React.useState(searchFn(query, type));

    return (
        <React.Fragment>
        <Box
            className="SearchAndFilters-tabletUp"
            sx={{
                borderRadius: 'sm',
                py: 2,
                display: { xs: 'none', sm: 'flex' },
                flexWrap: 'wrap',
                gap: 1.5,
                '& > *': {
                    minWidth: { xs: '120px', md: '160px' },
                },
            }}
        >
            <FormControl sx={{ flex: 1 }} size="sm">
                <FormLabel>Search for item by ID, Name or Description</FormLabel>
                <Input size="sm" placeholder="Search" startDecorator={<Search />} onChange={e => setQuery(e.target.value)} />
            </FormControl>
            <FormControl size="sm">
                <FormLabel>Type</FormLabel>
                <Select
                size="sm"
                placeholder="Filter by type"
                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                onChange={(e, value) => setType(value as string)}
                value={type}
                >
                    <Option key="default" value="">All</Option>
                    {sortedItemTypes.map((type) => <Option key={type} value={type}>{type}</Option>)}
                </Select>
            </FormControl>
            <Button onClick={() => setItems(searchFn(query, type))} size='sm'>Search</Button>
        </Box>
        <Sheet
            className="ItemTableContainer"
            variant="outlined"
            sx={{
            display: { xs: 'none', sm: 'initial' },
            width: '100%',
            borderRadius: 'sm',
            flexShrink: 1,
            overflow: 'auto',
            minHeight: 0,
            }}
        >
            <Table
                stickyHeader
                size="md"
                stripe="odd"
                variant="soft"
                hoverRow
                sx={{
                  '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                  '--Table-headerUnderlineThickness': '1px',
                  '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                  '--TableCell-paddingY': '4px',
                  '--TableCell-paddingX': '8px',
                }}
            >
                <caption>Click item to see in-game description</caption>
                <thead>
                    <tr>
                        <th style={{ width: 40, padding: '12px 6px', textAlign: 'center' }}>ID</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Name</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Type</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => <ItemRow key={item.id} item={item}></ItemRow>)}
                </tbody>
            </Table>
        </Sheet>
        </React.Fragment>
    );
};

function ItemRow(props: { item: Item }) {
    const {item} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <tr onClick={() => setOpen(!open)}>
                <td style={{textAlign: 'center'}}>
                    <Typography level="body-sm">{item.id}</Typography>
                </td>
                <td>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <img src={SmallImages[item.id]} />
                        <Typography level="body-xs">{item.name}</Typography>
                    </Box>
                </td>
                <td>
                    <Typography level="body-sm">{itemType(item)}</Typography>
                </td>
                <td>
                    <Typography level="body-sm">{item.weight}</Typography>
                </td>
            </tr>
            <tr key='${item.id}-desc'>
                <td style={{height: 0, padding: 0}} colSpan={4}>
                    {open && (
                        <Box sx={{
                            py: 3, // padding top & bottom
                            px: 2, // padding left & right
                            display: 'flex',
                            gap: 2,
                        }}>
                            <img style={{alignSelf: 'flex-start'}} src={LargeImages[item.id]} />
                            <div>{descriptionAsHTML(item.description)}</div>
                        </Box>
                    )}
                </td>
            </tr>
        </React.Fragment>
    )
}

export default ItemTable;