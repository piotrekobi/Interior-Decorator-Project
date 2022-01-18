import React from 'react';
import ReactDOM from 'react-dom';

import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import App from './App';

Enzyme.configure({ adapter: new Adapter() })

test('Properly adds rectangle', () => {
    const wrapper = mount(<App />)

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.state.children.length).toBe(0);

    wrapper.instance().handleAddRectangleClick(1, 2, 3);

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.state.children.length).toBe(1);

    let rectangle = wrapper.instance().spawnZone.current.decoratedRef.current.state.children[0];
    expect(rectangle.props.style.width).toBe(1);
    expect(rectangle.props.style.height).toBe(2);
    expect(rectangle.props.style.background).toBe(3);
})

test('Properly removes rectangle', () => {
    const wrapper = mount(<App />)

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.state.children.length).toBe(0);

    wrapper.instance().handleAddRectangleClick(1, 2, 3);

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.state.children.length).toBe(1);

    let id = wrapper.instance().spawnZone.current.decoratedRef.current.state.children[0].props.id
    wrapper.instance().spawnZone.current.decoratedRef.current.removeChildByID(id)

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.state.children.length).toBe(0);
})

test('Properly returns rectangle data', () => {
    let expectedRectangles = [
        {
          id: undefined,
          imageURL: undefined,       
          parent: 'spawn_zone',
          width: 1,
          height: 2,
          color: 3,
          offset: { left: 0, top: NaN }
        },
        {
          id: undefined,
          imageURL: undefined,
          parent: 'spawn_zone',
          width: 3,
          height: 2,
          color: 1,
          offset: { left: 0, top: NaN }
        },
        {
          id: undefined,
          imageURL: undefined,
          parent: 'spawn_zone',
          width: 1,
          height: 3,
          color: 2,
          offset: { left: 0, top: NaN }
        }
      ];

    const wrapper = mount(<App />)

    wrapper.instance().handleAddRectangleClick(1, 2, 3);
    wrapper.instance().handleAddRectangleClick(3, 2, 1);
    wrapper.instance().handleAddRectangleClick(1, 3, 2);

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.getRectangles()).toStrictEqual(expectedRectangles);
})

test('Properly sets rectangle data', () => {
    let rectangleData = [
        {
          id: undefined,       
          imageURL: undefined,
          parent: 'spawn_zone',
          width: 1,
          height: 2,
          color: 3,
          offset: { left: 0, top: NaN }
        },
        {
          id: undefined,
          imageURL: undefined,
          parent: 'spawn_zone',
          width: 3,
          height: 2,
          color: 1,
          offset: { left: 0, top: NaN }
        },
        {
          id: undefined,
          imageURL: undefined,
          parent: 'spawn_zone',
          width: 1,
          height: 3,
          color: 2,
          offset: { left: 0, top: NaN }
        }
      ];

    const wrapper = mount(<App />)

    wrapper.instance().spawnZone.current.decoratedRef.current.setRectangles(rectangleData);

    expect(wrapper.instance().spawnZone.current.decoratedRef.current.getRectangles()).toStrictEqual(rectangleData);
})