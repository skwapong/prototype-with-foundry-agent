'use client';

import { css } from '@emotion/react'
import { useRouter } from 'next/navigation'

interface AppCard {
  icon: React.ReactNode
  title: string
  description: string
  link?: string
  badge?: string
  isActive?: boolean
}

const HomePage = () => {
  const router = useRouter()

  const applications: AppCard[] = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z" fill="currentColor"/>
        </svg>
      ),
      title: 'AI Agent Foundry',
      description: 'Build and manage AI agents, apps and knowledge bases to power customer experiences.',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" fill="currentColor"/>
          <rect x="13" y="3" width="8" height="8" fill="currentColor"/>
          <rect x="3" y="13" width="8" height="8" fill="currentColor"/>
          <rect x="13" y="13" width="8" height="8" fill="currentColor"/>
        </svg>
      ),
      title: 'Foundry Workspace',
      description: 'Access and use purpose-built AI agents across campaigns, insights and operations.',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="currentColor"/>
        </svg>
      ),
      title: 'Engage Studio',
      description: 'Deliver and orchestrate AI-driven personalized email',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="2" fill="currentColor"/>
        </svg>
      ),
      title: 'Creative Studio',
      description: 'Use generative AI to create engaging and brand compliant content.',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="6" height="18" fill="currentColor"/>
          <rect x="11" y="8" width="6" height="13" fill="currentColor"/>
          <rect x="19" y="13" width="2" height="8" fill="currentColor"/>
        </svg>
      ),
      title: 'Audience Studio',
      description: 'Identify, understand, and segment target audiences to deliver personalized marketing campaigns',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18L9 12L13 16L21 8" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="21" cy="8" r="2" fill="currentColor"/>
        </svg>
      ),
      title: 'Growth Studio',
      description: 'Create, optimize, and analyze paid media campaign performance to drive measurable marketing growth',
      badge: 'Beta',
      link: '/campaign-hub',
      isActive: true,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor"/>
          <rect x="8" y="8" width="8" height="8" fill="white"/>
        </svg>
      ),
      title: 'Data Workbench',
      description: 'Manage queries, workflows, and databases to create Parent Segments',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="4" height="4" fill="currentColor"/>
          <rect x="10" y="3" width="4" height="4" fill="currentColor"/>
          <rect x="17" y="3" width="4" height="4" fill="currentColor"/>
          <rect x="3" y="10" width="4" height="4" fill="currentColor"/>
          <rect x="10" y="10" width="4" height="4" fill="currentColor"/>
          <rect x="17" y="10" width="4" height="4" fill="currentColor"/>
        </svg>
      ),
      title: 'Jobs',
      description: 'Quickly review the status of your queries and data imports',
      isActive: false,
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <path d="M12 1V5M12 19V23M23 12H19M5 12H1M20.5 3.5L17.5 6.5M6.5 17.5L3.5 20.5M20.5 20.5L17.5 17.5M6.5 6.5L3.5 3.5" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      title: 'Control Panel',
      description: 'Manage the settings of your Treasure Data Console',
      isActive: false,
    },
  ]

  const resources = [
    { icon: '📄', label: 'Documentation', link: '#' },
    { icon: '+', label: 'Release Notes', link: '#' },
    { icon: '🎓', label: 'TD Academy', link: '#' },
    { icon: '📦', label: 'Treasure Boxes', link: '#' },
    { icon: '💬', label: 'Live Chat', link: '#' },
    { icon: '🎫', label: 'Support Tickets', link: '#' },
    { icon: '🔄', label: 'System Status', link: '#' },
    { icon: '⌨', label: 'Keyboard Shortcuts', link: '#' },
  ]

  const handleCardClick = (app: AppCard) => {
    if (app.link) {
      router.push(app.link)
    }
  }

  return (
    <div css={css`
      display: flex;
      height: 100%;
      background-color: #f5f5f5;
    `}>
      {/* Main Content */}
      <div css={css`
        flex: 1;
        padding: 48px 64px;
        overflow-y: auto;
      `}>
        <h1 css={css`
          font-family: 'Figtree', sans-serif;
          font-size: 32px;
          font-weight: 600;
          color: #212327;
          margin: 0 0 48px 0;
        `}>
          Welcome Everyone!
        </h1>

        <h2 css={css`
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #212327;
          margin: 0 0 24px 0;
        `}>
          Your Applications
        </h2>

        <div css={css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
          max-width: 1400px;
        `}>
          {applications.map((app, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(app)}
              css={css`
                background: white;
                border-radius: 8px;
                padding: 24px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                cursor: ${app.link ? 'pointer' : 'default'};
                transition: all 0.2s;
                position: relative;

                &:hover {
                  box-shadow: ${app.link ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
                  transform: ${app.link ? 'translateY(-2px)' : 'none'};
                }
              `}
            >
              {app.badge && (
                <div css={css`
                  position: absolute;
                  top: 12px;
                  right: 12px;
                  background: #E3F2FD;
                  color: #1976D2;
                  padding: 4px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 500;
                `}>
                  {app.badge}
                </div>
              )}

              <div css={css`
                margin-bottom: 16px;
                color: ${app.isActive ? '#6F2EFF' : '#D0D5DD'};
              `}>
                {app.icon}
              </div>

              <h3 css={css`
                font-family: 'Figtree', sans-serif;
                font-size: 16px;
                font-weight: 600;
                color: ${app.isActive ? '#212327' : '#98A2B3'};
                margin: 0 0 8px 0;
              `}>
                {app.title}
              </h3>

              <p css={css`
                font-family: 'Figtree', sans-serif;
                font-size: 14px;
                color: ${app.isActive ? '#878F9E' : '#D0D5DD'};
                margin: 0;
                line-height: 1.5;
              `}>
                {app.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Resources Sidebar */}
      <div css={css`
        width: 280px;
        background: white;
        border-left: 1px solid #DCE1EA;
        padding: 48px 24px;
        overflow-y: auto;
      `}>
        <h3 css={css`
          font-family: 'Figtree', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #212327;
          margin: 0 0 24px 0;
        `}>
          Resources
        </h3>

        <div css={css`
          display: flex;
          flex-direction: column;
          gap: 4px;
        `}>
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.link}
              css={css`
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 6px;
                text-decoration: none;
                color: #212327;
                font-family: 'Figtree', sans-serif;
                font-size: 14px;
                transition: background-color 0.2s;

                &:hover {
                  background-color: #F9FBFF;
                }
              `}
            >
              <span css={css`
                font-size: 16px;
                opacity: 0.7;
              `}>{resource.icon}</span>
              {resource.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage
