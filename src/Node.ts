import { Vector } from "p5";
import p5 from "p5";
import { p5Container as p } from "./main";

export type Joint = { id: string; position: Vector; color: rgbColor };
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

    constructor(vector: Vector, color: rgbColor) {
        this.id = `${Math.round(vector.x)}${Math.round(vector.y)}`;
        this.position = vector;
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
                joints: jointsA,
                color: colorA,
            } = this;

            const {
                id: endID,
                position: { x: bX, y: bY },
                joints: jointsB,
                color: colorB,
            } = n;

            const dis = p.dist(aX, aY, bX, bY);

            if (
                startID !== endID &&
                dis < window.innerWidth / 8 &&
                jointsA.size <= 4 &&
                jointsB.size <= 4
            ) {
                this.joints.add([
                    {
                        id: startID,
                        position: new p5.Vector(aX, aY),
                        color: colorA,
                    },
                    {
                        id: endID,
                        position: new p5.Vector(bX, bY),
                        color: colorB,
                    },
                ]);
            }
        });
    }

    public checkHoverState(vector: Vector): void {
        const { position: nodePosition, radius } = this;
        const distanceVect = p5.Vector.sub(nodePosition, vector);
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
