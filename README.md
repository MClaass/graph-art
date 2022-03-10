# graph-art

This project generates a visualisation of a graph everytime you refresh the page. You can add and remove nodes by interacting with the canvas.

The color of the joint between two nodes is a 50/50 blend of the 2 node colors.

The number of generated nodes when instantiated is calculated from the width and height of the canvas and capped at a limit of to prevent lagging. This limit is set to 100 by default, but can be changed via the config settings.

## Setup

The instantiation of the graph canvas accepts a config file with default options when no options are given.

### Config settings

1. **width**: canvas width in pixels ( required)
2. **height**: canvas height in pixels ( required )

#### Optional

3. **colors**: an array of HSB colors ( example: [[194, 100, 10]] )
4. **nodeRadius**: radius of the node in pixels. Default: 6
5. **nodeLimit**: limit of nodes to render at first time in numbers. Default: 100
6. **nodeConnectionCap**: limit of connections each node accepts when rendering. Default: 4.
7. **distanceCap**: limit distance to other nodes to accept connections from in pixels. Default: 140.

configObject {
    width: number;
    height: number;
    colors?: hsbColor[];
    nodeRadius?: number;
    nodeLimit?: number;
    nodeConnectionCap?: number;
    distanceCap?: number;
}

Instantiate a new graph visualisation  by calling `new GraphCanvas(configObject)`.

## Development

The following commands are available to build/run the project:

| Command | Description |
| ----------- | ----------- |
| `yarn build` | Create production build within the `dist` folder |
| `yarn lint` | Lint the code via ESLint |
