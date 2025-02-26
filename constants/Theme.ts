export type ThemeType = {
    light: {
      text: string;
      background: string;
      icon: string;
      button: string;
      iconText:string;

    };
    dark: {
      text: string;
      background: string;
      icon: string;
      button: string;
      iconText:string;
    };
  };
export const Theme:ThemeType = {
    light: {
      text: "#1C1C1E", // Apple's system dark gray for text
      background: "#F2F2F7", // Light grayish background, used in iOS settings
      icon: "#3A3A3C", // Dark gray, subtle contrast
      button: "#007AFF", // Apple's signature blue
      iconText:'white'
    },
    dark: {
      text: "#F2F2F7", // Softer white text for dark mode
      background: "#000000", // True black (better for OLED)
      icon: "#D1D1D6", // Apple's system gray for icons in dark mode
      button: "#0A84FF", // iOS dark mode blue (less harsh than pure white)
      iconText:"black", // Apple's system gray for icons in;

    },
  };
  