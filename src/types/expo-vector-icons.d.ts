/**
 * Type declarations for @expo/vector-icons
 * 
 * This file provides type definitions for the @expo/vector-icons package
 * which doesn't ship with its own TypeScript definitions.
 */

declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  export const Ionicons: ComponentType<IconProps> & {
    glyphMap: Record<string, number>;
  };

  export const MaterialIcons: ComponentType<IconProps>;
  export const FontAwesome: ComponentType<IconProps>;
  export const Entypo: ComponentType<IconProps>;
  export const AntDesign: ComponentType<IconProps>;
  export const MaterialCommunityIcons: ComponentType<IconProps>;
  export const Feather: ComponentType<IconProps>;
  export const Foundation: ComponentType<IconProps>;
  export const EvilIcons: ComponentType<IconProps>;
  export const Octicons: ComponentType<IconProps>;
  export const SimpleLineIcons: ComponentType<IconProps>;
  export const Zocial: ComponentType<IconProps>;
  export const Fontisto: ComponentType<IconProps>;
}
