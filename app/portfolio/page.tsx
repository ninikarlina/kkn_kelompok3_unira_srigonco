"use client"

import { memo, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ProfileCard from '../components/ProfileCard';
import profileCards from '../../profilecard.json';

// Lazy load LiquidEther with no SSR
const LiquidEther = dynamic(() => import('../components/LiquidEther'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />
});

// Memoize ProfileCard wrapper
const MemoizedProfileCard = memo(ProfileCard);

function Page() {
  return (
    <div
        style={{
            width: "100vw",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            overflowX: "hidden",
            fontFamily: "'Roboto', sans-serif",
            backgroundColor: "black",
  }}
  >
      {/* Background LiquidEther - Optimized */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <LiquidEther
          colors={[
            '#5227FF',
            '#FF9FFC',
            '#B19EEF',
            '#00E5FF',
            '#00FF9C'
          ]}
          mouseForce={80}
          cursorSize={80}
          isViscous={false}
          viscous={20}
          iterationsViscous={16}
          iterationsPoisson={16}
          resolution={0.35}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.4}
          autoIntensity={1.8}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* Hero Section with Outline Style */}
      <section style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        padding: '20px',
        color: 'white',
        textAlign: 'center',
      }}>
        <h1 className="hero-title" style={{
          fontSize: 'clamp(1.5rem, 5vw, 4rem)',
          fontWeight: 'bold',
          WebkitTextStroke: '2px black',
          color: 'transparent',
          margin: 0,
          outline: '3px solid black',
          padding: '10px',
          borderRadius: '10px',
          maxWidth: '90vw',
          wordWrap: 'break-word',

        }}>
          Welcome to Portfolio KKN-T Kelompok 2
        </h1>
        <p className="hero-subtitle" style={{
          fontSize: 'clamp(1rem, 3vw, 1.5rem)',
          marginTop: '20px',
          WebkitTextStroke: '1px black',
          color: 'bLack',
          outline: '2px solid black',
          padding: '10px',
          borderRadius: '5px',
          maxWidth: '90vw',
          fontFamily: '"Roboto", sans-serif',
        }}>
          belum ada tag line guys nanti nanti ditambahin
        </p>
      </section>

      {/* Profile Card Section */}
      <section style={{
        position: 'relative',
        zIndex: 2,
        padding: 'clamp(10px, 5vw, 40px)',
        minHeight: '50vh',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div 
        className="profile-grid"
        style={{
          display: 'grid',
          gap: 'clamp(10px, 2vw, 20px)',
          justifyItems: 'center',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
        >
          {profileCards.map((card, index) => (
            <div key={`profile-${card.handle || index}`} >
              <MemoizedProfileCard
                {...card}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer with Outline */}
      <footer style={{
        position: 'relative',
        zIndex: 2,
        textAlign: 'center',
        padding: 'clamp(15px, 3vw, 20px)',
        color: 'white',
        outline: '2px solid black',
        marginTop: '20px',
      }}>
        <p style={{
          margin: 0,
          WebkitTextStroke: '1px black',
          color: 'black',
          fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        }}>
          KKN-T kelompok 2 Desa Srigonco Bantur
        </p>
      </footer>
    </div>
  );
}

export default memo(Page);