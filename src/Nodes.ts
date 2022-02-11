import { Joints, GraphNode, nodeID } from "./Node";

export class Nodes {
    list: Map<nodeID, GraphNode>;

    constructor() {
        this.list = new Map();
    }

    public add(node: GraphNode): void {
        this.list.set(node.id, node);
    }

    public remove(nodeID: nodeID): void {
        this.list.delete(nodeID);
    }

    public joinToOtherNodes(
        startNode: GraphNode,
        nodeList: Map<nodeID, GraphNode>,
        p: p5
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
