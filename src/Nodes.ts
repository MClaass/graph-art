import { Node } from "./Node";

export interface Nodes {
    list: Set<Node>;
    add(node: Node): void;
    remove(node: Node): void;
    displayNodes(): void;
    joinNodes(): void;
    removeJoints(node: Node): void;
}

export class Nodes implements Nodes {
    constructor() {
        this.list = new Set();
    }

    public add(node: Node): void {
        this.list.add(node);
    }

    public remove(node: Node): void {
        this.list.delete(node);
    }

    public displayNodes(): void {
        this.list.forEach((b) => {
            b.display();
        });
    }

    public joinNodes(): void {
        if (this.list.size > 1) {
            this.list.forEach((b) => {
                const slicedNodeList = new Set(this.list);
                slicedNodeList.delete(b);
                b.joinNodes(slicedNodeList);
            });
        }
    }

    public removeJoints(node: Node): void {
        const { id } = node;

        this.list.forEach((node) => {
            const joints = node.joints;
            const jointsToRemove = [...joints].filter(
                ([_, end]) => end.id === id
            );
            jointsToRemove.map((j) => node.joints.delete(j));
        });
    }
}
