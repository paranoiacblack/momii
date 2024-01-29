import React = require("react");

export default function descriptionAsHTML(description: string): React.ReactElement {
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