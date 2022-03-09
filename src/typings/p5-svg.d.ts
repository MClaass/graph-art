import p5 from "p5";

declare module "p5" {
    export interface p5InstanceExtensions {
        createCanvas(
            w: number,
            height: number,
            renderer?: RENDERER | "svg"
        ): Renderer;
    }
}
