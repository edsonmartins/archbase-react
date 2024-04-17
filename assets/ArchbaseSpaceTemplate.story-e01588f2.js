import{j as r}from"./jsx-runtime-29545a09.js";import{A as c}from"./ArchbaseActionButtons-b2eda210.js";import{A as d}from"./ArchbaseGlobalFilter-0cc0fe9e.js";import{A as u}from"./ActionsDemo-0896ac51.js";import{A as l}from"./ArchbaseSpaceTemplate-dfb58c61.js";import{C as h}from"./Grid-72b79d89.js";import"./index-76fb7be0.js";import"./_commonjsHelpers-de833af9.js";import"./polymorphic-factory-e212381f.js";import"./Mantine.context-0732ca39.js";import"./use-media-query-404d9c84.js";import"./px-90b8b31c.js";import"./Tooltip-6d7d1342.js";import"./OptionalPortal-d3ff2b4f.js";import"./index-d3ea75b5.js";import"./use-isomorphic-effect-f46ba680.js";import"./use-merged-ref-962e80ee.js";import"./DirectionProvider-3f93a9e9.js";import"./use-floating-auto-update-8b56efba.js";import"./use-did-update-4c7f685e.js";import"./Transition-7fd90e94.js";import"./use-reduced-motion-94535b68.js";import"./get-style-object-71cabcb5.js";import"./use-id-9525279e.js";import"./Space-3f7303e6.js";import"./Menu-7b6c8f09.js";import"./create-scoped-keydown-handler-870d0701.js";import"./use-resolved-styles-api-777d9903.js";import"./Popover-b9d763ca.js";import"./create-safe-context-978e3819.js";import"./FocusTrap-0274480a.js";import"./use-uncontrolled-625105b4.js";import"./UnstyledButton-6bceb5b8.js";import"./Button-45c30308.js";import"./Loader-2934e180.js";import"./createReactComponent-1d99d95b.js";import"./index-9d475cdf.js";import"./ActionIcon-23bc393d.js";import"./Text-052cbebe.js";import"./index-1076ae77.js";import"./useArchbaseTheme-69c231ab.js";import"./i18next-a4b2730f.js";import"./use-debounced-value-a20d2599.js";import"./Flex-472ba316.js";import"./TextInput-256f3fb5.js";import"./InputBase-b1a2e9dc.js";import"./Input-abb5d566.js";import"./create-optional-context-e52a7171.js";import"./use-input-props-0bcecfab.js";import"./IconSearch-ce888152.js";import"./IconRefresh-cf6950e7.js";import"./index-f91c0534.js";import"./IconDeviceFloppy-9fc3d121.js";import"./IconTrash-7ea9d6f5.js";import"./IconSettings-d48e6046.js";import"./index-ecced42e.js";import"./use-hotkeys-89517bd5.js";import"./Paper-9304c07a.js";import"./ScrollArea-d1e51cef.js";import"./ArchbaseAlert-d4f20d19.js";import"./Alert-1c6f8f93.js";import"./CloseButton-c44b8f52.js";import"./IconBug-81bb8ee5.js";import"./ArchbaseSpaceFixed-f95bf0a2.js";import"./ArchbaseDebugInspector-0735b76f.js";import"./ArchbaseObjectInspector-39e1a2c0.js";import"./use-mantine-color-scheme-940af2ab.js";import"./use-resize-observer-ba39df3b.js";import"./Accordion-ee2e152a.js";import"./AccordionChevron-793bd026.js";import"./ArchbaseAppContext-a2fe1edf.js";import"./use-local-storage-21e66413.js";import"./Group-ec80c87c.js";import"./get-sorted-breakpoints-91e0685a.js";const t=()=>r("div",{style:{width:"100%",height:"calc(100vh - 50px)"},children:r(l,{title:"Pessoas",options:{headerFlexGrow:"right"},headerLeft:r(h,{children:r(d,{minFilterValueLength:3,searchableFields:["id","cpf","nome","idade"],onFilter:s=>console.log(s)})}),headerRight:r(c,{actions:u,options:{largerBreakPoint:"800px",smallerBreakPoint:"400px",largerSpacing:"2rem",smallerSpacing:"0.5rem",largerButtonVariant:"filled",smallerButtonVariant:"filled",menuItemVariant:"filled",menuButtonVariant:"filled",menuButtonColor:"blue.5",menuItemApplyActionColor:!0,menuPosition:"right"}})})}),jr={title:"Modelos/Space template",component:l},o={name:"Exemplo simples",render:()=>r(t,{})};var e,i,m;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`() => {
  return <div style={{
    width: '100%',
    height: 'calc(100vh - 50px)'
  }}>
            <ArchbaseSpaceTemplate title="Pessoas" options={{
      headerFlexGrow: 'right'
    }} headerLeft={<Card>
                        <ArchbaseGlobalFilter minFilterValueLength={3} searchableFields={['id', 'cpf', 'nome', 'idade']} onFilter={value => console.log(value)} />
                    </Card>} headerRight={<ArchbaseActionButtons actions={ActionsDemo} options={{
      largerBreakPoint: '800px',
      smallerBreakPoint: '400px',
      largerSpacing: '2rem',
      smallerSpacing: '0.5rem',
      largerButtonVariant: 'filled',
      smallerButtonVariant: 'filled',
      menuItemVariant: 'filled',
      menuButtonVariant: 'filled',
      menuButtonColor: 'blue.5',
      menuItemApplyActionColor: true,
      menuPosition: 'right'
    }} />} />
        </div>;
}`,...(m=(i=t.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var p,a,n;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  name: 'Exemplo simples',
  render: () => <ArchbaseSpaceTemplateExample />
}`,...(n=(a=o.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};export{t as ArchbaseSpaceTemplateExample,o as Primary,jr as default};
