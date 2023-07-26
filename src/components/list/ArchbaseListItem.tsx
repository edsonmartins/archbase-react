import React, { ReactNode } from 'react';

export interface ArchbaseListItemProps {
  active: boolean;
  activeBackColor?: string;
  activeColor?: string;
  align?: 'left' | 'right' | 'center';
  backgroundColor?: string;
  caption: string;
  color: string;
  disabled: boolean;
  hide: boolean;
  href: string;
  icon?: ReactNode | string;
  id: any;
  image?: ReactNode | string;
  imageCircle?: boolean;
  imageHeight?: string;
  imageWidth?: string;
  justify?: boolean;
  onSelectListItem?: (index: number, data: any) => void;
  showBorder?: boolean;
}

export function ArchbaseListItem({
//   active,
//   activeBackColor,
//   activeColor,
//   align,
//   backgroundColor,
//   caption,
//   color,
//   disabled,
//   hide,
//   href,
//   icon,
//   id,
//   image,
//   imageCircle,
//   imageHeight,
//   imageWidth,
//   justify,
//   onSelectListItem,
//   showBorder = true,
}: ArchbaseListItemProps) {
//   const onClick = (event) => {
//     event.preventDefault();
//     if (!disabled) {
//       if (handleSelectItem) {
//         handleSelectItem(index, recordData);
//       }
//       if (onSelectListItem) {
//         onSelectListItem(index, recordData);
//       }
//     }
//   };

//   const onMouseOver = (event) => {
//     if (onMouseOver) {
//       onMouseOver(this, event);
//     }
//   };

//   const onMouseOut = (event) => {
//     if (onMouseOut) {
//       onMouseOut(this, event);
//     }
//   };

//   let className = AnterosUtils.buildClassNames(
//     showBorder ? 'list-group-item-border' : 'list-group-item',
//     'list-group-item-action',
//     className ? className : '',
//     active ? 'active' : '',
//     disabled ? 'disabled' : '',
//     success ? 'list-group-item-success' : '',
//     info ? 'list-group-item-info' : '',
//     warning ? 'list-group-item-warning' : '',
//     danger ? 'list-group-item-danger' : '',
//     alignRight ? 'justify-content-end' : '',
//     alignLeft ? 'justify-content-start' : '',
//     alignCenter ? 'justify-content-center' : '',
//     justify ? 'justify-content-between' : '',
//   );

//   let icon;
//   if (icon) {
//     icon = <i style={{ marginLeft: '3px', marginRight: '3px' }} className={icon}></i>;
//   }

//   let style = {};
//   if (activeBackColor && activeColor && active) {
//     style = { backgroundColor: activeBackColor, color: activeColor };
//   } else if (backgroundColor && color && !active) {
//     style = { backgroundColor: backgroundColor, color: color };
//   }

//   let classNameImage;
//   if (imageCircle) {
//     classNameImage = ' img-circle';
//   }

//   const idItem = 'lstItem_' + ownerId + '_' + id;
//   const keyItem = 'lstItem_' + ownerId + '_' + id;

//   if (children) {
//     return (
//       <li
//         href={href}
//         className={className}
//         onMouseOver={onMouseOver}
//         onMouseOut={onMouseOut}
//         id={idItem}
//         onClick={onClick}
//         key={keyItem}
//       >
//         {caption}
//         {children}
//       </li>
//     );
//   }

  return (
    // <li
    //   tabIndex={-1}
    //   style={style}
    //   href={href}
    //   className={className}
    //   onClick={onClick}
    //   onMouseOver={onMouseOver}
    //   onMouseOut={onMouseOut}
    //   id={idItem}
    //   key={keyItem}
    // >
    //   {icon}{' '}
    //   <img
    //     style={{ marginLeft: '3px', marginRight: '3px' }}
    //     className={classNameImage}
    //     src={image}
    //     height={imageHeight}
    //     width={imageWidth}
    //   />{' '}
    //   {caption}
    // </li>
    <div></div>
  );
}
