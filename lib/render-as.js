// @flow
import * as React from 'react';

type AsableProps = {
  as: React.ElementType | React.Element<any>,
  children: React.Node,
  [string]: any
};

export const renderAs = (defaultAs: React.ElementType) => {
  const AsableComponent = (props: AsableProps): React.Node => {
    const { as, ...rest } = props;
    let Component;

    if (React.isValidElement(as)) {
      // $FlowFixMe
      Component = as.type;
      // $FlowFixMe
      Object.assign(rest, as.props);
    } else {
      Component = as;
    }

    return /* $FlowFixMe */ (
      <Component {...rest}>{rest.children}</Component>
    );
  };

  const displayName = typeof defaultAs === 'string'
    ? defaultAs
    : defaultAs.displayName || defaultAs.name || 'Component';

  AsableComponent.displayName = `renderAs(${displayName})`;
  AsableComponent.defaultProps = {
    as: defaultAs
  };

  return AsableComponent;
};

export const withAs = (Component: React.ComponentType<any>, defaultAs: React.ElementType) => {
  const AsableComponent = renderAs(defaultAs);

  const WithAs = (props: AsableProps): React.Node => (
    <AsableComponent {...props}>
      <Component {...props}>
        {props.children}
      </Component>
    </AsableComponent>
  );

  WithAs.displayName = `withAs(${Component.displayName || Component.name || 'Component'})`;

  return WithAs;
};
