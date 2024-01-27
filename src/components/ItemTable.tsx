import { Item, itemTypes } from '../lib/item_parser';
import React = require('react');
import { Table, IconButton, Input, Sheet, Box, FormControl, FormLabel, Typography, Option, Select, Button } from '@mui/joy';
import { FilterAlt, Search } from '@mui/icons-material';
import redPotSmall from "../../static/images/small/501.png";
import redPotLarge from "../../static/images/large/501.png";

interface TableProps {
    items: Item[]
}

function ItemTable(props: TableProps) {
    const { items } = props;
    const sortedItemTypes = Array.from(itemTypes);
    sortedItemTypes.sort();

    return (
        <React.Fragment>
        <Sheet
            className="SearchAndFilters-mobile"
            sx={{
            display: { xs: 'flex', sm: 'none' },
            my: 1,
            gap: 1,
            }}
        >
            <Input
                size="sm"
                placeholder="Search"
                startDecorator={<Search />}
                sx={{ flexGrow: 1 }}
            />
            <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
            >
                <FilterAlt />
            </IconButton>
        </Sheet>
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
                <FormLabel>Search for item by ID, Name or Description </FormLabel>
                <Input size="sm" placeholder="Search" startDecorator={<Search />} />
            </FormControl>
            <FormControl size="sm">
                <FormLabel>Type</FormLabel>
                <Select
                size="sm"
                placeholder="Filter by type"
                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="">All</Option>
                    {sortedItemTypes.map((type) => <Option value={type}>{type}</Option>)}
                </Select>
            </FormControl>
            <Button size='sm'>Search</Button>
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
                    {items.map((item) => <ItemRow item={item}></ItemRow>)}
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
                        <img src={redPotSmall} />
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
            <tr>
                <td style={{height: 0, padding: 0}} colSpan={4}>
                    {open && (
                        <Box sx={{
                            py: 3, // padding top & bottom
                            px: 2, // padding left & right
                            display: 'flex',
                            gap: 2,
                        }}>
                            <img style={{alignSelf: 'flex-start'}} src={redPotLarge} />
                            <div>{descriptionAsHTML(item.description)}</div>
                        </Box>
                    )}
                </td>
            </tr>
        </React.Fragment>
    )
}

function itemType(item: Item): string {
    let type: string = item.type;
    if (item.subType) {
        type += " - " + item.subType;
    }
    return type;
}

function descriptionAsHTML(description: string): React.ReactElement {
    let children: React.ReactElement[] = [];
    let blocks = description.split('\n');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === "")
            continue;

        children.push(<span>{blocks[i]}</span>);
        if (i !== blocks.length - 1) {
            children.push(<br />);
        }
    }
    return <React.Fragment>{children}</React.Fragment>;
}

export default ItemTable;