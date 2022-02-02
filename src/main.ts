import "./style.css";
import { Node } from "./Node";
import { Nodes } from "./Balls";
import p5 from "p5";

const balls = new Nodes();
const { list: ballList } = balls;

const s = (p: p5) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode("hsb", 360, 100, 100, 100);
        p.angleMode("degrees");

        const randomBallGeneration = Math.round(
            Math.min((p.width * p.height) / 7000, 100)
        );

        for (let i = 0; i < randomBallGeneration; i++) {
            const x = p.random(p.windowWidth);
            const y = p.random(p.windowHeight);
            createNode(x, y);
        }

        balls.displayNodes();
        balls.joinNodes();
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
        balls.displayNodes();
        balls.joinNodes();

        return false;
    };
};

function createNode(x: number, y: number): void {
    const newNode = new Node(x, y);

    const collidedWithNewNode = [...ballList].some((b) =>
        newNode.checkCollision(b)
    );

    if (!newNode.checkBoundaryCollision() && !collidedWithNewNode) {
        balls.add(newNode);
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
