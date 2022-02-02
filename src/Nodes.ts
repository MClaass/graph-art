import { Node } from "./Node";

export class Nodes {
    list: Set<Node>;

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
