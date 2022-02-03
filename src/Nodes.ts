import { Node, nodeID } from "./Node";
import { p5Container as p } from "./main";

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

    public displayJoints(): void {
        this.list.forEach((n) => {
            const { joints } = n;
            joints.forEach(([j1, j2]) => {
                const { color: startColor, position: start } = j1;
                const { color: endColor, position: end } = j2;
                const strokeColor = p.lerpColor(
                    p.color(startColor),
                    p.color(endColor),
                    0.5
                );
                p.stroke(strokeColor);
                p.line(start.x, start.y, end.x, end.y);
            });
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

    public removeJoints(nodeID: nodeID): void {
        this.list.forEach((node) => {
            const joints = node.joints;
            const jointsToRemove = [...joints].filter(
                ([_, end]) => end.id === nodeID
            );
            if (jointsToRemove.length > 0) {
                jointsToRemove.map((j) => node.joints.delete(j));
            }
        });
    }
}
