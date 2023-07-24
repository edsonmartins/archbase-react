import React, { useState } from 'react'
import {ArchbaseReactTabs, ArchbaseTab } from './ArchbaseReactTabs'
import {Button, ColorScheme} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

export default {
  title: 'Archbase React Tabs',
  component: ArchbaseReactTabs,
};

export const Default = () => {
    const [tabs, setTabs] = useState<ArchbaseTab[]>([
      { key: 0, favicon: "https://www.google.com/favicon.ico", title: "Google" },
      { key: 1, favicon: "https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico", title: "Facebook" },
      { key: 2, favicon: "https://it108.wke.csie.ncnu.edu.tw/edu.ico", title: "IT Technology" }
    ])
    const [colorScheme] = useLocalStorage<ColorScheme>({
      key: 'mantine-color-scheme',
      defaultValue: 'light',
      getInitialValueInEffect: true
    })
    const [key, setID] = useState(2)
    const [current, setCurrent] = useState(0)
  
    const addTab = (isCurrent: any) => {
      let tab : ArchbaseTab[] = [{ key: key + 1, title: "Nova Tab",favicon: "https://it108.wke.csie.ncnu.edu.tw/edu.ico" }]
      let tmpTabs = tabs.concat(tab);
      !!isCurrent && setCurrent(key + 1)
      setID(key + 1)
      setTabs(tmpTabs)
    }
  
    const onClose = (key: any) => {
      let tmpTabs = tabs.filter(f => f.key !== key);
      let idx = -1; 
      tabs.forEach((f, index) => f.key === current && (idx = index))
      let isCurrent = tmpTabs.filter(f => f.key === current).length > 0 ? true : false;
      let tmpCurrent = tmpTabs.length > 0 ? (tmpTabs[idx] ? tmpTabs[idx].key : tmpTabs[tmpTabs.length - 1].key) : null;
      !isCurrent && setCurrent(tmpCurrent)
      setTabs(tmpTabs)
    }
    console.log(colorScheme)
  
    return (
      <div className={`root ${colorScheme==='light' ? "" : " dark-theme"}`}>
        <div className='surface'>
          <div className="mock-browser">
            <ArchbaseReactTabs
              currentTabs={tabs}
              dark={colorScheme==='dark'}
              activeTab={current}
              onClick={key => setCurrent(key)}
              onClose={key => onClose(key)}
              onChange={tabs => setTabs(tabs)}
            />
            <div className="chrome-tabs-optional-shadow-below-bottom-bar"></div>
            <div className="mock-browser-content">
              <div className="buttons">
                <Button onClick={e => addTab(true)} data-add-tab>Adicionar nova Tab</Button>
                <Button onClick={e => addTab(true)} data-add-background-tab>Adicionar nova Tab em background</Button>
                <Button onClick={e => onClose(current)} data-remove-tab>Remover Tab ativa</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }