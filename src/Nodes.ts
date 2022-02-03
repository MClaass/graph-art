import { Node, nodeID } from "./Node";

export class Nodes {
    list: Map<nodeID, Node>;

    constructor() {
        this.list = new Map();
    }

    public add(node: Node): void {
        this.list.set(node.id, node);
    }

    public remove(nodeID: nodeID): void {
        this.list.delete(nodeID);
    }

    public displayNodes(): void {
        this.list.forEach((b) => {
            b.display();
        });
    }

    public joinNodes(): void {
        if (this.list.size > 1) {
            this.list.forEach((n) => {
                const slicedNodeList = new Map(this.list);
                slicedNodeList.delete(n.id);
                n.joinNodes(slicedNodeList);
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
