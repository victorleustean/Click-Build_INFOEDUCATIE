'use client'

import FlowingMenu from './React_Bits/FlowingMenu'
import { useLanguage } from '@/lib/i18n/LanguageContext'

const demoItems = [
    { link: 'https://brutariapetru.netlify.app/', text: 'Brutăria Petru', image: '/Bp.png' },
    { link: 'https://nebuladrivetech.netlify.app/', text: 'Nebula drive', image: '/Nd.png' },
    { link: 'https://scutulanti-acnee.netlify.app/', text: 'Scutul Anti-Acnee', image: '/Sc.png' },
    { link: 'https://vulcanizarea-moderna.netlify.app/', text: 'Vulcanizarea modernă', image: '/Vm.png' },
];

const Projects = () => {
  const { t } = useLanguage()

  return (
    <div style={{ height: '600px', position: 'relative' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.1, margin: '0 0 3rem 0', textAlign: 'center', padding: '3rem 1.5rem 0' }}>
            {t('projects.title')}
        </h1>
        <FlowingMenu
            items={demoItems}
            speed={15}
            textColor="#ffffff"
            bgColor="#e91e63"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#120F17"
            borderColor="#ffffff"
        />
    </div>
  )
}

export default Projects