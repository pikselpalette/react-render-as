# React Render As

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This library lets you easily create components which take an `as` prop to change which component they should render as

## Installation

```sh
npm i --save react-render-as
```

## Usage

### Creating simple components

```jsx
import { renderAs } from 'react-render-as';

const SomeComponent = ({ name }) => (<div>Hello {name}!</div>);

const Bold = renderAs('b');

(<Bold>This is bold</Bold>) // <b>This is bold</b>

(<Bold as="i">Tricked you its italics</Bold>) // <i>Tricked you its italics</i>

(<Bold as={SomeComponent} />) // <div>Hello !</div>

(<Bold as={<SomeComponent name="Joe" />} />) // <div>Hello Joe!</div>
```

### Using the HOC

```jsx
import { withAs } from 'react-render-as';

const Table = ({ children }) => children;

export default withAs(Table, 'table');
```
