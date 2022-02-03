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

        nodes.displayNodes();
        nodes.joinNodes();
    };

    p.mouseClicked = () => {
        // const isHovered = updateHoverState();

        // if (isHovered.length === 1) {
        //     isHovered[ 0 ].removeJoints();
        //     ballList.delete(isHovered[ 0 ]);

        //     p.clear(0, 0, 0, 0);

        //     displayBalls();

        //     return false;
        // }

        createNode(p.mouseX, p.mouseY);
        nodes.displayNodes();
        nodes.joinNodes();

        return false;
    };
};

function createNode(x: number, y: number): void {
    const color = getRandomFromArray(colors) as rgbColor;
    const newNode = new Node(x, y, color);

    const collidedWithNewNode = [...nodeList].some(([_, node]) =>
        newNode.checkCollision(node)
    );

    if (!newNode.checkBoundaryCollision() && !collidedWithNewNode) {
        nodes.add(newNode);
    }
}

// function updateHoverState(): Ball[] {
//     return [ ...ballList ]
//         .map((b) => {
//             b.checkHoverState();
//             return b;
//         })
//         .filter((b) => b.isHovered);
// }

export const p5Container = new p5(s);
