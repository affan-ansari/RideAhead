// SafeAreaComponent.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaComponentProps extends ViewProps {
  children?: React.ReactNode;
}

const SafeAreaComponent: React.FC<SafeAreaComponentProps> = ({
  children,
  style,
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default SafeAreaComponent;
