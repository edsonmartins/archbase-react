import { ActionIcon, Image, ImageProps, Input, MantineNumberSize, Modal, Paper } from '@mantine/core';
import { IconEdit } from '@tabler/icons-react';
import { ArchbaseDataSource } from '../../components/datasource';
import React, { CSSProperties, useState } from 'react';
import { archbaseLogo } from '../../components/core';
import { ArchbaseImageEditor } from '../../components/image/ArchbaseImageEditor';

export interface ArchbaseImageEditProps<T, ID> extends ImageProps {
  /** Fonte de dados onde será atribuido o valor do rich edit*/
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do rich edit na fonte de dados */
  dataField?: string;
  /** Indicador se o rich edit está desabilitado */
  disabled?: boolean;
  /** Indicador se o rich edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do rich edit é obrigatório */
  required?: boolean;
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Texto sugestão do rich edit */
  placeholder?: string;
  /** Título do rich edit */
  label?: string;
  /** Descrição do rich edit */
  description?: string;
  /** Último erro ocorrido no rich edit */
  error?: string;
  variant?: string;
  /** Image src */
  src?: string | null;
  /** Texto alternativo da imagem, usado como título para espaço reservado se a imagem não foi carregada */
  alt?: string;
  /** Propriedade de ajuste do objeto da imagem */
  fit?: React.CSSProperties['objectFit'];
  /** Largura da imagem, padrão de 100%, não pode exceder 100% */
  width?: number | string;
  /** Altura da imagem, o padrão é a altura da imagem original ajustada para determinada largura */
  height?: number | string;
  /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
  radius?: MantineNumberSize;
  /** Ativar espaço reservado quando a imagem está carregando e quando a imagem falha ao carregar */
  withPlaceholder?: boolean;
  /** Os adereços se espalham para o elemento img */
  imageProps?: React.ComponentPropsWithoutRef<'img'>;
  /** Obter ref do elemento de imagem */
  imageRef?: React.ForwardedRef<HTMLImageElement>;
  /** Legenda da imagem, exibida abaixo da imagem */
  caption?: React.ReactNode;
}

export function ArchbaseImageEdit<T, ID>({
  width = 240,
  height = 240,
  dataSource,
  dataField,
  disabled,
  readOnly,
  required,
  placeholder,
  label,
  description,
  error,
  radius = 'md',
  ...otherProps
}: ArchbaseImageEditProps<T, ID>) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Input.Wrapper
        withAsterisk={required}
        label={label}
        placeholder={placeholder}
        description={description}
        error={error}
      >
        <Image
          src={
            archbaseLogo
          }
          width={width}
          height={height}
          radius={radius}
          {...otherProps}
        />
      </Input.Wrapper>
      <ActionIcon
        size="xl"
        color="blue"
        style={{ position: 'absolute', top: 40, right: 8 }}
        onClick={() => setIsEditing(true)}
      >
        <IconEdit />
      </ActionIcon>
      {isEditing && (
        <Modal opened={isEditing} onClose={() => setIsEditing(false)} size="80%" padding="md" title="Editar Imagem">
          <Paper>
            <ArchbaseImageEditor src={archbaseLogo}/>
          </Paper>
        </Modal>
      )}
    </div>
  );
}
