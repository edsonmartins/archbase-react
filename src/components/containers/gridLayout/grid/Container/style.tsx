export interface ContainerStyleProps {
  fluid?: boolean;
  xs?: boolean;
  sm?: boolean;
  md?: boolean;
  lg?: boolean;
  xl?: boolean;
  xxl?: boolean;
  xxxl?: boolean;
  screenClass: string;
  containerWidths: number[];
  gutterWidth: number;
  moreStyle?: { [key: string]: number | string };
}

const getContainerStyle = ({
  fluid,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  xxxl,
  screenClass,
  containerWidths,
  gutterWidth,
  moreStyle,
}: ContainerStyleProps) => {
  const styles: React.CSSProperties = {
    boxSizing: 'border-box',
    position: 'relative',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: gutterWidth / 2,
    paddingRight: gutterWidth / 2,
  };

  if (fluid && !xs && !sm && !md && !lg && !xl) {
    return { ...styles, ...moreStyle };
  }

  if (screenClass === 'xs' && containerWidths[0] && !xs) {
    styles.maxWidth = containerWidths[0];
  }

  if (screenClass === 'sm' && containerWidths[1] && !sm) {
    styles.maxWidth = containerWidths[1];
  }

  if (screenClass === 'md' && containerWidths[2] && !md) {
    styles.maxWidth = containerWidths[2];
  }

  if (screenClass === 'lg' && containerWidths[3] && !lg) {
    styles.maxWidth = containerWidths[3];
  }

  if (screenClass === 'xl' && containerWidths[4] && !xl) {
    styles.maxWidth = containerWidths[4];
  }

  if (screenClass === 'xxl' && containerWidths[5] && !xxl) {
    styles.maxWidth = containerWidths[5];
  }
  
  if (screenClass === 'xxxl' && containerWidths[6] && !xxxl) {
    styles.maxWidth = containerWidths[6];
  }

  return { ...styles, ...moreStyle };
};

export default getContainerStyle;
