import { Box, List, ListItem, ListItemContent, Typography, Input, Sheet, IconButton, Button, Divider, Modal, ModalDialog, ModalClose, ListItemDecorator, Option, ListDivider, Select, Link, DialogTitle } from "@mui/joy";
import { Item, itemTypes, itemType } from "../lib/item_parser";
import React = require("react");
import { FilterAlt, Search } from "@mui/icons-material";
import descriptionAsHTML from "../lib/item_description";
import { SmallImages } from "../lib/item_images";

interface ListProps {
    searchFn(query: string, type: string): Item[]
}

function ItemList(props: ListProps) {
    const { searchFn } = props;
    const sortedItemTypes = Array.from(itemTypes);
    sortedItemTypes.sort();

    const [query, setQuery] = React.useState("");
    const [type, setType] = React.useState("");
    const [items, setItems] = React.useState(searchFn(query, type));
    return (
        <>
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
                placeholder="Name or Description"
                startDecorator={<Search />}
                sx={{ flexGrow: 1 }}
                onChange={e => setQuery(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key == 'Enter') {
                        setItems(searchFn(query, type))
                    }
                }}
            />
            <Select
                size="sm"
                placeholder="Filter by type"
                slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                value={type}
                onChange={(e, value) => setType(value as string)}
            >
                <Option key="default" value="">All</Option>
                {sortedItemTypes.map((type) => <Option key={type} value={type}>{type}</Option>)}
            </Select>
            <Button
                size="sm"
                onClick={() => setItems(searchFn(query, type))}
            >
                Search
            </Button>
        </Sheet>
        <Box>
            {items.map((item) => <ItemRow item={item} />)}
        </Box>
        </>
    );
}

function ItemRow(props: { item: Item }) {
    const {item} = props;
    const [open, setOpen] = React.useState(false);
    return (
        <>
        <List
            key={item.id}
            size="sm"
            sx={{
                '--ListItem-paddingX': 0,
            }}
        >
            <ListItem
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                }}
            >
                <ListItemContent sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                    <ListItemDecorator>
                        <img src={SmallImages[item.id]} />
                    </ListItemDecorator>
                    <div>
                        <Typography fontWeight={600} gutterBottom>{item.name}</Typography>
                        <Typography level="body-xs" gutterBottom>{itemType(item)}</Typography>
                        <Typography level="body-xs" gutterBottom>Weight: {item.weight}</Typography>
                    </div>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Link level="body-sm" component="button" onClick={() => setOpen(true)}>
                            Details
                        </Link>
                    </Box>
                </ListItemContent>
            </ListItem>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                    <ModalClose />
                    <DialogTitle>{item.name}</DialogTitle>
                    <Box
                        sx={{
                            overflow: 'scroll',
                            mx: 'calc(-1 * var(--ModalDialog-padding))',
                            px: 'var(--ModalDialog-padding)',
                        }}
                    >
                        {descriptionAsHTML(item.description)}
                    </Box>
                </ModalDialog>
            </Modal>
            <ListDivider />
        </List>
        </>
    );
}

export default ItemList;