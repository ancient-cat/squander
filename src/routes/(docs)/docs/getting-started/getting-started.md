<script>
    import HelloWorld from "./HelloWorld.svelte";
</script>

# Getting Started

## Setup a SvelteKit or Svelte project

`squander` exports a component that works well with sveltekit and svelte. <br /><br />

Follow the svelte cli for creating a new barebones, typescript-enabled sveltekit project.

## Installation

To start with you'll need to install the package, and it's peer dependencies.

```sh
npm i squander@latest svelte pixi.js
```

## Usage

By whatever mechanism you combine these libraries, as long as you can import a svelte component you can continue with the next steps.

### 1. Use Game component

```svelte
<script lang="ts">
  import { Game, app } from "squander";

  async function start_game() {
    // start your game code here
    // pixi.js renderer is available
    app.ticker.add(() => {
      console.log("Game loop");
    });

    // alternately, you can import a function and call it
    // import my_function from "./my_function";
    // <Game onStart={my_function} />
  }
</script>

<Game onStart={start_game} />
```

[Need to know about what's happening behind the scenes?](https://github.com/ancient-cat/squander/blob/7b40080d8e1babe74d74d17f2942306ee87e874f/src/lib/core/index.ts)

### 2. Create a Scene

```ts
// my_scene.ts
import { Scenes, app } from "squander";

export default Scenes.create(async () => {
  // this space here is powerful
  // it is a closure for your scene which allows you to initialize systems, load assets, and more.

  // return a Scene object
  return {
    // required
    name: "Hello World",
    update: (ticker) => {},
    // below are optional, but likely to be used
    // init: () => {},
    // enter: () => {},
    // exit: () => {},
  };
});
```

<small>
Note: It's suggested to create scenes within a `src/scenes` directory.
</small>

### 3. Switch to your scene

```svelte
<script lang="ts">
  import { Game, app, Scenes } from "squander";
  import my_scene from "./scenes/my_scene.ts";

  async function start_game() {
    Scenes.switch(my_scene);
  }
</script>

<Game onStart={start_game} />
```

### Next Steps

The above steps are the boilerplate needed to understand how to initialize the pixi.js renderer, and create a scene—but it doesn't actually do anything.

To complete the experience in hello-world fashion, add this to `my_scene.ts`:

```diff
// my_scene.ts
import { Scenes, app } from "squander";
+ import { Text } from "pixi.js"

export default Scenes.create(async () => {

    // this space here is powerful
    // it is a closure for your scene which allows you to initialize systems, load assets, and more.

    // return a Scene object
    return {
        // required
        name: "Hello World",
        update: (ticker) => {},
        // below are optional, but likely to be used
        // init: () => {},
-        // enter: () => {},
+        enter: () => {
+           const text = new Text({
+              text: "Hello World",
+              x: app.canvas.width / 2,
+              y: app.canvas.height / 2,
+           });
+
+            app.stage.addChild(text)
+
+           // a function returned from 'enter' is the same as exit
+           return () => {
+                app.stage.removeChild(text)
+            }
+
+       },
-        // exit: () => {},
    }
});
```

Which will result in this simple screen:

<HelloWorld />
