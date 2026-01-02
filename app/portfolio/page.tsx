"use client"

import LiquidEther from '../components/LiquidEther';
import ProfileCard from '../components/ProfileCard';
import profileCards from '../../profilecard.json';

export default function Page() {
  return (
    <div
        style={{
            width: "100vw",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            overflowX: "hidden",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "black",
  }}
  >
      {/* Background LiquidEther */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <LiquidEther
          colors={[
            '#5227FF', // ungu biru
            '#FF9FFC', // pink
            '#B19EEF', // lavender
            '#00E5FF', // cyan
            '#00FF9C', // mint
            '#FFD166', // kuning lembut
            '#FF6B6B', // coral
            '#6CFF95', // hijau muda
            '#FFA07A', // salmon
            '#8BE9FD'  // biru pastel
          ]}

          mouseForce={100}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
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
            <div key={index} >
              <ProfileCard
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
          KKN-T kelompok 3 Desa Srigonco Bantur
        </p>
      </footer>
    </div>
  );
}