import "./style.css";
import { Node, rgbColor } from "./Node";
import { Nodes } from "./Nodes";
import { getRandomArbitrary, getRandomFromArray } from "./utils";
import p5 from "p5";
import { colors } from "./constants";

const nodes = new Nodes();
const { list: nodeList } = nodes;

const s = (p: p5) => {
    p.setup = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        p.createCanvas(width, height);
        p.colorMode("hsb", 360, 100, 100, 100);
        p.angleMode("degrees");

        const randomNodeGeneration = Math.round(
            Math.min((width * height) / 7000, 100)
        );

        for (let i = 0; i < randomNodeGeneration; i++) {
            const x = getRandomArbitrary(0, width);
            const y = getRandomArbitrary(0, height);
            createNode(x, y);
        }

        renderNodes();
    };

    p.mouseClicked = () => {
        const hoveredNode = isNodeHovered();

        if (hoveredNode !== undefined) {
            nodes.removeJoints(hoveredNode.id);
            nodes.remove(hoveredNode.id);

            p.clear(0, 0, 0, 0);

            renderNodes();

            return false;
        }

        createNode(p.mouseX, p.mouseY);
        renderNodes();

        return false;
    };
};

function createNode(x: number, y: number): void {
    const color = getRandomFromArray(colors) as rgbColor;
    const vector = new p5.Vector(x, y);
    const newNode = new Node(vector, color);

    const collidedWithNewNode = [...nodeList].some(([_, node]) =>
        newNode.checkCollision(node)
    );

    if (!newNode.checkBoundaryCollision() && !collidedWithNewNode) {
        nodes.add(newNode);
    }
}

function isNodeHovered(): Node | undefined {
    const mouseVector = new p5.Vector(p5Container.mouseX, p5Container.mouseY);
    const node = [...nodeList]
        .map(([_, node]) => {
            node.checkHoverState(mouseVector);
            return node;
        })
        .filter((node) => node.isHovered === true);

    return node.length > 0 ? node[0] : undefined;
}

function renderNodes(): void {
    nodes.displayNodes();
    nodes.joinNodes();
    nodes.displayJoints();
}

export const p5Container = new p5(s);
