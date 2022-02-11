import { Vector } from "p5";
import p5 from "p5";
import CONSTANTS from "./constants";

export type Joint = { id: string; position: Vector; color: hsbColor };
export type Joints = [Joint, Joint];
export type hsbColor = [number, number, number];
export type nodeID = string;

export class GraphNode {
    id: nodeID;
    position: Vector;
    radius: number;
    color: hsbColor;
    joints: Set<Joints>;
    isHovered: boolean;

    constructor(vector: Vector, color: hsbColor) {
        this.id = `${Math.round(vector.x)}${Math.round(vector.y)}`;
        this.position = vector;
        this.radius = CONSTANTS.NODE_RADIUS;
        this.color = color;
        this.joints = new Set();
        this.isHovered = false;
    }

    public checkBoundaryCollision(width: number, height: number): boolean {
        const {
            position: { x, y },
            radius,
        } = this;

        const xBboundaryCollision = x > width - radius || x < radius;
        const yBoundaryCollision = y > height - radius || y < radius;

        if (xBboundaryCollision || yBoundaryCollision) {
            return true;
        }

        return false;
    }

    public checkCollision(otherNode: GraphNode): boolean {
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

    public checkHoverState(vector: Vector): void {
        const { position: nodePosition, radius } = this;
        const distanceVect = p5.Vector.sub(nodePosition, vector);
        const distanceVectMag = distanceVect.mag();

        this.isHovered = distanceVectMag < radius ? true : false;
    }

    public addJoints(joints: Joints): void {
        this.joints.add(joints);
    }
}
