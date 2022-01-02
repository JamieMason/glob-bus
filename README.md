# glob-bus

249 byte pub/sub event bus with namespaced wildcard support.

[![NPM version](http://img.shields.io/npm/v/glob-bus.svg?style=flat-square)](https://www.npmjs.com/package/glob-bus)
[![NPM downloads](http://img.shields.io/npm/dm/glob-bus.svg?style=flat-square)](https://www.npmjs.com/package/glob-bus)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

## Installation

```
npm install --save glob-bus
```

## Example

In this example, all three listeners will be invoked.

```ts
import { globBus } from 'glob-bus';

type Event =
  | { type: 'basket.product.add'; id: number }
  | { type: 'basket.product.remove'; id: number };

const { on, send } = globBus<Event>();

on('*', (event: Event) => console.log(1, event));
on('basket.*', (event: Event) => console.log(2, event));
on('basket.product.*', (event: Event) => console.log(3, event));

send({ type: 'basket.product.add', id: 123 });
```

The `on` function returns a function to unregister the given listener:

```ts
import { globBus } from 'glob-bus';

const { on, send } = globBus();
const off = on('basket.product.*', fn);

off();
```
