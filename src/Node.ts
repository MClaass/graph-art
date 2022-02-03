import { Vector } from "p5";
import p5 from "p5";
import { p5Container as p } from "./main";

export type Joint = { id: string; x: number; y: number };
export type Joints = [Joint, Joint];
export type rgbColor = [number, number, number];
export type nodeID = string;

export class Node {
    id: nodeID;
    position: Vector;
    radius: number;
    color: rgbColor;
    joints: Set<Joints>;
    isHovered: boolean;

    constructor(x: number, y: number, color: rgbColor) {
        this.id = `${Math.round(x)}${Math.round(y)}`;
        this.position = new p5.Vector(x, y);
        this.radius = 6;
        this.color = color;
        this.joints = new Set();
        this.isHovered = false;
    }

    public checkBoundaryCollision(): boolean {
        const {
            position: { x, y },
            radius,
        } = this;

        const xBboundaryCollision = x > p.width - radius || x < radius;
        const yBoundaryCollision = y > p.height - radius || y < radius;

        if (xBboundaryCollision || yBoundaryCollision) {
            return true;
        }

        return false;
    }

    public checkCollision(otherNode: Node): boolean {
        const { position, radius } = this;
        const { position: oPosition, radius: oRadius } = otherNode;
        const distanceVect = p5.Vector.sub(oPosition, position);

        // Calculate magnitude of the vector separating the balls
        const distanceVectMag = distanceVect.mag();

        // Minimum distance before they are touching
        const minDistance = radius + oRadius;

        if (distanceVectMag < minDistance) {
            return true;
        }

        return false;
    }

    public joinNodes(nodeList: Map<nodeID, Node>): void {
        nodeList.forEach((n) => {
            const {
                id: startID,
                position: { x: aX, y: aY },
                color: colorA,
                joints: jointsA,
            } = this;

            const {
                id: endID,
                position: { x: bX, y: bY },
                color: colorB,
                joints: jointsB,
            } = n;

            const dis = p.dist(aX, aY, bX, bY);

            if (
                startID !== endID &&
                dis < window.innerWidth / 8 &&
                jointsA.size <= 4 &&
                jointsB.size <= 4
            ) {
                this.addJoint([
                    { id: startID, x: aX, y: aY },
                    { id: endID, x: bX, y: bY },
                ]);

                const colorDefA = p.color(colorA);
                const colorDefB = p.color(colorB);
                const strokeColor = p.lerpColor(colorDefA, colorDefB, 0.5);
                p.stroke(strokeColor);
                p.line(aX, aY, bX, bY);
            }
        });
    }

    public addJoint(joint: Joints): void {
        this.joints.add(joint);
    }

    public checkHoverState(): void {
        const { position: nodePosition, radius } = this;
        const mousePosition = new p5.Vector(mouseX, mouseY);
        const distanceVect = p5.Vector.sub(nodePosition, mousePosition);
        const distanceVectMag = distanceVect.mag();

        this.isHovered = distanceVectMag < radius ? true : false;
    }

    public display(): void {
        p.noStroke();

        const {
            position: { x, y },
            radius,
            color,
        } = this;

        p.fill(color);
        p.circle(x, y, radius);
    }
}
