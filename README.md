# graph-art

This project generates a visualisation of a graph everytime you refresh the page. You can add and remove nodes by interacting with the canvas.

The colors of the nodes are chosen randomly from a list of hsb colors. The color of the joint between two nodes is a 50/50 blend of the 2 node colors.

The number of generated nodes when instantiated is calculated from the width and height of the canvas and capped at a limit of **100** nodes to prevent lagging.

## Setup

Parameters used when initializing:

1. **width**: canvas width
2. **height**: canvas height

Instantiate a new graph visualisation  by calling `new GraphCanvas(width, height)`.

## Development

This package uses [Vite](https://vitejs.dev/) to build the project.
The following commands are available to build/run the project:

| Command | Description |
| ----------- | ----------- |
| `yarn dev` | Starts a local dev server at port `7000` |
| `yarn build` | Create production build within the `dist` folder |
| `yarn preview` | Show a preview of production level code |
| `yarn lint` | Lint the code via ESLint |
