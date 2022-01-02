import 'expect-more-jest';
import { globBus } from '.';

test('listen to a typical event', () => {
  const bus = globBus<{ type: 'purchase'; foo: string }>();
  const spy = jest.fn();
  const unbind = bus.on('purchase', spy);
  const event = { type: 'purchase', foo: 'bar' } as const;
  bus.send(event);
  expect(spy).toHaveBeenCalledTimes(1);
  unbind();
  bus.send(event);
  expect(spy).toHaveBeenCalledWith(event);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('listen to an exact match for a namespaced event', () => {
  const bus = globBus();
  const spy = jest.fn();
  const spy2 = jest.fn();
  bus.on('item', spy);
  bus.on('item.add', spy2);
  bus.send({ type: 'item.add' });
  expect(spy).toHaveBeenCalledTimes(0);
  expect(spy2).toHaveBeenCalledTimes(1);
});

test('listen to all events below a namespace', () => {
  const bus = globBus();
  const spy = jest.fn();
  const spy1 = jest.fn();
  const spy2 = jest.fn();
  bus.on('basket', spy);
  bus.on('basket.*', spy1);
  bus.on('basket.product.*', spy2);
  bus.send({ type: 'basket.product.add' });
  bus.send({ type: 'basket.product' });
  expect(spy).toHaveBeenCalledTimes(0);
  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(1);
});

test('listen to all events', () => {
  const bus = globBus<
    | {
        type: 'basket.product.add';
        id: number;
      }
    | {
        type: 'basket.product';
        foo: string;
      }
  >();
  const spy = jest.fn();
  bus.on('*', spy);
  bus.send({ type: 'basket.product.add', id: 123 });
  bus.send({ type: 'basket.product', foo: 'bar' });
  expect(spy).toHaveBeenCalledTimes(2);
});

test('do not invoke handlers not matching a pattern', () => {
  const bus = globBus();
  const spy = jest.fn();
  bus.on('basket.product.add', spy);
  bus.send({ type: 'basket.product' });
  bus.send({ type: 'basket' });
  expect(spy).toHaveBeenCalledTimes(0);
});
