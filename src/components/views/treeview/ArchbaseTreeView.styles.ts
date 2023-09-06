import { createStyles } from "@mantine/styles";

export const useStyles = createStyles((_theme) => ({
    treeview: {
      minHeight: 100,
      padding: 4,
      marginBottom: 20,
      fontSize: 14,
      lineHeight: 20,
      height: '100%',
    },
    treeviewUl: {
      paddingLeft: 28,
      margin: '0 0 0 0',
    },
    treeviewLi: {
      listStyleType: 'none',
      margin: 0,
      position: 'relative',
      lineHeight: 16,
      '&::before': {
        content: "''",
        left: -16,
        position: 'absolute',
        right: 'auto',
        borderLeft: '1px dotted #999',
        bottom: 30,
        height: '100%',
        top: -2,
        width: 1,
      },
      '&::after': {
        content: "''",
        left: -16,
        position: 'absolute',
        right: 'auto',
        borderTop: '1px dotted #999',
        height: 20,
        top: 15,
        width: 22,
      },
    },
    treeviewSpan: {
      MozBorderRadius: 2,
      WebkitBorderRadius: 2,
      display: 'inline-block',
      padding: 2,
      textDecoration: 'none',
    },
    treeviewImg: {
      verticalAlign: 'middle',
      height: 'auto',
      maxWidth: '100%',
    },
    treeviewParentLiSpan: {
      cursor: 'pointer',
    },
    treeviewLastChildBefore: {
      height: 18,
    },
    treeviewItem: {
      background: 'auto',
      color: 'black',
      margin: '1px 1px 1px 2px',
      '&:hover': {
        background: '#e7f4f9',
        color: 'black',
        margin: '1px 1px 1px 2px',
      },
    },
  }));