import { Joints, Node, nodeID } from "./Node";
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
                this.joinToOtherNodes(n, slicedNodeList);
            });
        }
    }

    public joinToOtherNodes(
        startNode: Node,
        nodeList: Map<nodeID, Node>
    ): void {
        nodeList.forEach((endNode) => {
            const {
                id: startID,
                position: startPosition,
                joints: jointsA,
                color: colorA,
            } = startNode;

            const {
                id: endID,
                position: endPosition,
                joints: jointsB,
                color: colorB,
            } = endNode;

            const dis = p.dist(
                startPosition.x,
                startPosition.y,
                endPosition.x,
                endPosition.y
            );

            if (
                startID !== endID &&
                dis < window.innerWidth / 8 &&
                jointsA.size <= 4 &&
                jointsB.size <= 4
            ) {
                const joints = [
                    {
                        id: startID,
                        position: startPosition,
                        color: colorA,
                    },
                    {
                        id: endID,
                        position: endPosition,
                        color: colorB,
                    },
                ] as Joints;

                startNode.addJoints(joints);
            }
        });
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
