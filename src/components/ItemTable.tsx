import { Item } from '../lib/item_parser';
import React = require('react');
import { Table, IconButton, Sheet } from '@mui/joy';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

interface TableProps {
    items: Item[]
}

function ItemTable(props: TableProps) {
    const { items } = props;

    return (
        <Table
            stickyHeader
            size="md"
            stripe="odd"
            variant="soft"
        >
            <caption>Click item to see in-game description</caption>
            <thead>
                <tr>
                    <th style={{ width: '1%' }} aria-label="empty" />
                    <th style={{width: '5%', textAlign: 'center'}}>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => <ItemRow item={item}></ItemRow>)}
            </tbody>
        </Table>
    );
};

function ItemRow(props: { item: Item }) {
    const {item} = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <tr>
                <td>
                    <IconButton
                        aria-label="expand row"
                        variant="plain"
                        color="neutral"
                        size="sm"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </td>
                <td style={{textAlign: 'center'}}>{item.id}</td>
                <td>{item.name}</td>
            </tr>
            <tr>
                <td style={{height: 0, padding: 0}} colSpan={6}>
                    {open && (
                        <Sheet>
                            {descriptionAsHTML(item.description)}
                        </Sheet>
                    )}
                </td>
            </tr>
        </React.Fragment>
    )
}

function descriptionAsHTML(description: string): React.ReactElement {
    let children: React.ReactElement[] = [];
    let blocks = description.split('\n');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i] === "") {
            children.push(<br />);
            continue
        }

        children.push(<span>{blocks[i]}</span>);
        if (i !== blocks.length - 1) {
            children.push(<br />);
        }
    }
    return <React.Fragment>{children}</React.Fragment>;
}

export default ItemTable;