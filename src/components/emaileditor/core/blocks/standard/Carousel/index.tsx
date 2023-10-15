import React from 'react';
import { IBlockData } from '@emaileditor/core/typings';
import { BasicType } from '@emaileditor/core/constants';
import { createBlock } from '@emaileditor/core/utils/createBlock';
import { getImg } from '@emaileditor/core/utils/getImg';
import { mergeBlock } from '@emaileditor/core/utils/mergeBlock';
import { BasicBlock } from '@emaileditor/core/components/BasicBlock';
import { t } from '@emaileditor/core/utils';

export type ICarousel = IBlockData<
  {
    align?: string;
    'background-color'?: string;
    'border-radius'?: string;
    'icon-width'?: string;
    'left-icon'?: string;
    'right-icon'?: string;
    'tb-border'?: string;
    'tb-border-radius'?: string;
    'tb-hover-border-color'?: string;
    'tb-selected-border-color'?: string;
    'tb-width'?: string;
    thumbnails?: string;
  },
  {
    images: Array<{
      src: string;
      target: string;
      href?: string;
      'thumbnails-src'?: string;
      title?: string;
      rel?: string;
      alt?: string;
    }>;
  }
>;

export const Carousel = createBlock<ICarousel>({
  get name() {
    return t('archbase:Carousel');
  },
  type: BasicType.CAROUSEL,
  create: (payload) => {
    const defaultData: ICarousel = {
      type: BasicType.CAROUSEL,
      data: {
        value: {
          images: [
            {
              src: getImg('IMAGE_15'),
              target: '_blank',
            },
            {
              src: getImg('IMAGE_16'),
              target: '_blank',
            },
            {
              src: getImg('IMAGE_17'),
              target: '_blank',
            },
          ],
        },
      },
      attributes: {
        align: 'center',
        'left-icon': 'https://i.imgur.com/xTh3hln.png',
        'right-icon': 'https://i.imgur.com/os7o9kz.png',
        'icon-width': '44px',
        thumbnails: 'visible',
      },
      children: [],
    };
    return mergeBlock(defaultData, payload);
  },
  validParentType: [BasicType.COLUMN],

  render(params) {
    const { data } = params;
    const carouselImages = (data ).data.value.images
      .map((image) => {
        const imageAttributeStr = Object.keys(image)
          .filter((key) => key !== 'content' && image[key as keyof typeof image] !== '') // filter att=""
          .map((key) => `${key}="${image[key as keyof typeof image]}"`)
          .join(' ');
        return `
      <mj-carousel-image ${imageAttributeStr} />
      `;
      })
      .join('\n');
    return <BasicBlock params={params} tag="mj-carousel">{carouselImages}</BasicBlock>;
  },
});
