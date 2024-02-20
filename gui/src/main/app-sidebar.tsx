import React from 'react'
import { Icon } from '@iconify/react'
import { useAnimate } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { cn } from '@/helpers/cn'

import { ConfigContext } from './config'
import { AppTitleBar } from './app-titlebar'
import { Link, useLocation } from 'react-router-dom'

export function AppSidebar() {
  const [cfg] = React.useContext(ConfigContext)

  const [scope, animate] = useAnimate()
  React.useEffect(() => {
    animate('a, button', { opacity: [0, 1] }, { delay: 0.25 })
  }, [])

  React.useEffect(() => {
    animate(
      'span',
      { opacity: +!cfg.sidebarMinified, display: cfg.sidebarMinified ? 'none' : 'block' },
      { duration: 0.175, ease: 'circIn' }
    )
  }, [cfg.sidebarMinified])

  return (
    <div
      ref={scope}
      className={cn(
        'relative z-50 grid grid-rows-[0fr_1fr_0fr] gap-5',
        'select-none overflow-visible whitespace-nowrap px-[10px] py-3',
        'bg-[rgba(3,5,19,0.33)] text-white',
        'transition-[width_250ms_ease-out]'
      )}
      style={{
        width: cfg.sidebarMinified ? '76px' : '175px'
      }}
    >
      <AppTitleBar />
      <Nav />
    </div>
  )
}

const NavItems = [
  {
    icons: ['ri:search-line', 'ri:search-fill'],
    href: 'tracking'
  },
  {
    icons: ['ion:document-text-outline', 'ion:document-text'],
    href: 'sessions'
  },
  {
    icons: ['clarity:sign-out-line', 'clarity:sign-out-solid'],
    href: 'output'
  },
  {
    icons: ['teenyicons:cog-outline', 'teenyicons:cog-solid'],
    href: 'settings'
  }
] as const

function Nav() {
  const location = useLocation()
  const { t } = useTranslation()
  const [cfg] = React.useContext(ConfigContext)

  return (
    <nav>
      {NavItems.map(({ href, icons }) => {
        const selected = location.pathname.includes(href)
        return (
          <Link
            to={href}
            className={cn(
              'flex items-center justify-between',
              'group flex items-center justify-between',
              'transition-colors hover:bg-slate-50 hover:bg-opacity-5 hover:!text-white active:bg-[rgba(255,255,255,.075)]',
              'rounded px-1 py-2 text-lg text-[#bfbcff] text-opacity-80'
            )}
            style={{
              fontWeight: selected ? '600' : '200',
              color: selected ? '#d6d4ff' : '#bfbcff'
            }}
          >
            <div className='flex items-center justify-between'>
              <Icon
                icon={selected ? icons[1] : icons[0]}
                className='mr-1 h-7 w-10 text-highlight transition-colors'
              />
              <span>{t(href)}</span>
            </div>
            {!cfg.sidebarMinified && (
              <Icon
                icon='fa6-solid:chevron-left'
                className='h-3 w-3 rotate-180 opacity-0 transition-opacity group-hover:opacity-100'
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
