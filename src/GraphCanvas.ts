import CONSTANTS from "./constants";
import { GraphNode, hsbColor } from "./Node";
import { Nodes } from "./Nodes";
import { getRandomArbitrary, getRandomFromArray } from "./utils";
import p5 from "p5";

type canvasConfig = {
    width: number;
    height: number;
    colors?: hsbColor[];
    nodeRadius?: number;
    nodeLimit?: number;
    nodeConnectionCap?: number;
    distanceCap?: number;
};

export class GraphCanvas {
    config: canvasConfig;
    nodes: Nodes;
    canvas: (p: p5) => p5;

    constructor(config: canvasConfig) {
        this.config = config;
        const { nodeConnectionCap, distanceCap } = this.config;
        const connectionCapConfig =
            nodeConnectionCap === undefined
                ? CONSTANTS.NODE_CONNECTION_CAP
                : nodeConnectionCap;
        const distanceCapConfig =
            distanceCap === undefined ? CONSTANTS.DISTANCE_CAP : distanceCap;

        this.nodes = new Nodes({
            distanceCap: distanceCapConfig,
            connectionCap: connectionCapConfig,
        });
        this.canvas = (p: p5): p5 => {
            p.setup = () => {
                const { width, height, nodeLimit } = this.config;
                const maxNodeLimit =
                    nodeLimit === undefined ? CONSTANTS.NODE_LIMIT : nodeLimit;
                p.createCanvas(width, height);
                p.colorMode("hsb", 360, 100, 100, 100);
                p.angleMode("degrees");

                const randomNodeGeneration = Math.round(
                    Math.min((width * height) / 7000, maxNodeLimit)
                );

                for (let i = 0; i < randomNodeGeneration; i++) {
                    const x = getRandomArbitrary(0, width);
                    const y = getRandomArbitrary(0, height);
                    this.createNode(x, y);
                }

                this.renderNodes(p);
            };

            p.mouseClicked = () => {
                const hoveredNode = this.isNodeHovered(p);

                if (hoveredNode !== undefined) {
                    this.nodes.removeJoints(hoveredNode.id);
                    this.nodes.remove(hoveredNode.id);

                    p.clear(0, 0, 0, 0);

                    this.renderNodes(p);

                    return;
                }

                this.createNode(p.mouseX, p.mouseY);
                this.renderNodes(p);
            };
            return p;
        };

        new p5(this.canvas);
    }

    private createNode(x: number, y: number): void {
        const { nodeRadius, colors, width, height } = this.config;
        const color = getRandomFromArray(
            colors === undefined ? CONSTANTS.COLORS : colors
        ) as hsbColor;
        const vector = new p5.Vector(x, y);
        const newNode = new GraphNode(
            vector,
            color,
            nodeRadius === undefined ? CONSTANTS.NODE_RADIUS : nodeRadius
        );
        const { list: nodeList } = this.nodes;

        const collidedWithNewNode = [...nodeList].some(([_, node]) =>
            newNode.checkCollision(node)
        );

        if (
            !newNode.checkBoundaryCollision(width, height) &&
            !collidedWithNewNode
        ) {
            this.nodes.add(newNode);
        }
    }

    private renderNodes(p: p5): void {
        this.displayNodes(p);
        this.joinNodes(p);
        this.displayJoints(p);
    }

    private isNodeHovered(canvas: p5): GraphNode | undefined {
        const mouseVector = new p5.Vector(canvas.mouseX, canvas.mouseY);
        const { list: nodeList } = this.nodes;

        const node = [...nodeList]
            .map(([_, node]) => {
                node.checkHoverState(mouseVector);
                return node;
            })
            .filter((node) => node.isHovered === true);

        return node.length > 0 ? node[0] : undefined;
    }

    private displayNodes(p: p5): void {
        this.nodes.list.forEach((n) => {
            this.display(n, p);
        });
    }

    private display(n: GraphNode, p: p5): void {
        p.noStroke();

        const {
            position: { x, y },
            radius,
            color,
        } = n;

        p.fill(color);
        p.circle(x, y, radius);
    }

    private displayJoints(p: p5): void {
        this.nodes.list.forEach((n) => {
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

    private joinNodes(p: p5): void {
        const { list } = this.nodes;
        if (list.size > 1) {
            list.forEach((n) => {
                const slicedNodeList = new Map(list);
                slicedNodeList.delete(n.id);
                this.nodes.joinToOtherNodes(n, slicedNodeList, p);
            });
        }
    }
}
