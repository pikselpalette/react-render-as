/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import { renderAs, withAs } from '../../lib/render-as';

Enzyme.configure({ adapter: new Adapter() });

let Component;

class TestClassComponent extends React.Component {
  render() {
    return (
      <b>{this.props.children}</b>
    );
  }
}

class TestClassComponent2 extends React.Component {
  render() {
    return (
      <b>{this.props.children}</b>
    );
  }
}

const TestFunctionalComponent = ({ children }) => (
  <b>{children}</b>
);

const TestFunctionalComponent2 = ({ children }) => (
  <b>{children}</b>
);

const sharedTests = (defaultAs) => {
  it('does not return a React element', () => {
    expect(React.isValidElement(Component)).toBeFalsy();
  });

  it('can be mounted', () => {
    expect(() => {
      mount((
        <Component />
      ));
    }).not.toThrow();
  });

  it(`will render as ${defaultAs.name || defaultAs} by default`, () => {
    expect(mount(<Component />).find(defaultAs)).toHaveLength(1);
  });

  it('will render children passed to the component', () => {
    expect(mount((
      <Component>
        Hello world
      </Component>
    ))).toHaveText('Hello world');
  });

  it('can render as a `p` HTML element', () => {
    expect(mount(<Component as="p" />).find('p')).toHaveLength(1);
  });

  it('can render as a class component', () => {
    expect(mount(<Component as={TestClassComponent} />).find(TestClassComponent)).toHaveLength(1);
  });

  it('can render as a class component with JSX', () => {
    const component = mount(<Component as={<TestClassComponent foo="bar" />} />);
    expect(component.find(TestClassComponent)).toHaveLength(1);
    expect(component.find(TestClassComponent)).toHaveProp('foo', 'bar');
  });

  it('can render as a functional component', () => {
    expect(mount(<Component as={TestFunctionalComponent} />).find(TestFunctionalComponent)).toHaveLength(1);
  });

  it('can render as a functional component with JSX', () => {
    const component = mount(<Component as={<TestFunctionalComponent foo="bar" />} />);
    expect(component.find(TestFunctionalComponent)).toHaveLength(1);
    expect(component.find(TestFunctionalComponent)).toHaveProp('foo', 'bar');
  });
};

describe('withAs', () => {
  const sharedWithAsTests = (WrappedComponent) => {
    it('will always render the actual component', () => {
      expect(mount(<Component />).find(WrappedComponent)).toHaveLength(1);
    });
  };

  describe('with a class component', () => {
    beforeEach(() => {
      Component = withAs(TestClassComponent2, 'p');
    });

    sharedTests('p');
    sharedWithAsTests(TestClassComponent2);
  });

  describe('with a functional component', () => {
    beforeEach(() => {
      Component = withAs(TestFunctionalComponent2, 'p');
    });

    sharedTests('p');
    sharedWithAsTests(TestFunctionalComponent2);
  });

  describe('displayName', () => {
    it('is set correctly when passed a class component', () => {
      expect(withAs(TestClassComponent, 'div').displayName)
        .toEqual('withAs(TestClassComponent)');
    });

    it('is set correctly when passed a functional component', () => {
      expect(withAs(TestFunctionalComponent, 'div').displayName)
        .toEqual('withAs(TestFunctionalComponent)');
    });

    it('is set correctly when passed component has no name or displayName', () => {
      expect(withAs(() => (<b />), 'div').displayName)
        .toEqual('withAs(Component)');
    });
  });
});

describe('renderAs', () => {
  describe('displayName', () => {
    it('is set correctly when passed a string', () => {
      expect(renderAs('div').displayName).toEqual('renderAs(div)');
    });

    it('is set correctly when passed a class component', () => {
      expect(renderAs(TestClassComponent).displayName)
        .toEqual('renderAs(TestClassComponent)');
    });

    it('is set correctly when passed a functional component', () => {
      expect(renderAs(TestFunctionalComponent).displayName)
        .toEqual('renderAs(TestFunctionalComponent)');
    });

    it('is set correctly when passed component has no name or displayName', () => {
      expect(renderAs(() => (<b />)).displayName)
        .toEqual('renderAs(Component)');
    });
  });

  describe('when passed a `div` string', () => {
    beforeEach(() => {
      Component = renderAs('div');
    });

    sharedTests('div');
  });

  describe('when passed a class component', () => {
    beforeEach(() => {
      Component = renderAs(TestClassComponent);
    });

    sharedTests(TestClassComponent);
  });

  describe('when passed JSX containing a class component', () => {
    beforeEach(() => {
      Component = renderAs(<TestClassComponent />);
    });

    sharedTests(TestClassComponent);
  });

  describe('when passed a functional component', () => {
    beforeEach(() => {
      Component = renderAs(TestFunctionalComponent);
    });

    sharedTests(TestFunctionalComponent);
  });

  describe('when passed JSX containg a functional component', () => {
    beforeEach(() => {
      Component = renderAs(<TestFunctionalComponent />);
    });

    sharedTests(TestFunctionalComponent);
  });

  describe('when passed another renderAs component', () => {
    let WrappedRenderAs;
    let component;

    beforeEach(() => {
      WrappedRenderAs = renderAs('div');
      Component = renderAs(WrappedRenderAs);

      component = mount(<Component as={WrappedRenderAs} />);
    });

    sharedTests('div');

    it('will render the original renderAs', () => {
      expect(component.find(WrappedRenderAs)).toHaveLength(1);
    });

    it('sets the original renderAs as prop to its default', () => {
      expect(component.find(WrappedRenderAs)).toHaveProp('as', 'div');
    });

    describe('when as set', () => {
      beforeEach(() => {
        component.setProps({ as: 'p' });
      });

      it('renders the wrapped render as with the new as prop', () => {
        expect(component.find(WrappedRenderAs)).toHaveProp('as', 'p');
      });
    });
  });
});
