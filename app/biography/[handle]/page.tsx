"use client"

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import biographyData from '../../../biography.json';
import './page.css';

interface Biography {
  handle: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  education: string;
  location: string;
  email: string;
  phone: string;
  social: {
    [key: string]: string | undefined;
  };
  avatarUrl: string;
  achievements: string[];
}

export default function BiographyPage() {
  const params = useParams();
  const router = useRouter();
  const [bio, setBio] = useState<Biography | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = params.handle as string;
    const foundBio = biographyData.find((b) => b.handle === handle);
    
    if (foundBio) {
      setBio(foundBio as Biography);
    }
    setLoading(false);
  }, [params]);

  if (loading) {
    return (
      <div className="brutalism-loading">
        <div className="loading-box">
          <h1>LOADING...</h1>
        </div>
      </div>
    );
  }

  if (!bio) {
    return (
      <div className="brutalism-error">
        <div className="error-box">
          <h1>404</h1>
          <p>Biography not found</p>
          <button onClick={() => router.push('/')} className="brutalism-btn">
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="brutalism-container">
      {/* Header */}
      <header className="brutalism-header">
        <button onClick={() => router.push('/')} className="back-btn">
          ← BACK
        </button>
        <h1 className="brutalism-title">BIOGRAPHY</h1>
      </header>

      {/* Main Content */}
      <main className="brutalism-main">
        {/* Profile Section */}
        <section className="brutalism-section profile-section">
          <div className="profile-header">
            <div className="avatar-container">
              <img src={bio.avatarUrl} alt={bio.name} className="brutalism-avatar" />
              <div className="avatar-border"></div>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{bio.name}</h2>
              <p className="profile-title">{bio.title}</p>
              <p className="profile-handle">@{bio.handle}</p>
            </div>
          </div>
          <div className="bio-text">
            <h3 className="section-label">ABOUT</h3>
            <p>{bio.bio}</p>
          </div>
        </section>

        {/* Skills Section */}
        <section className="brutalism-section skills-section">
          <h3 className="section-label">SKILLS</h3>
          <div className="skills-grid">
            {bio.skills.map((skill, index) => (
              <div key={index} className="skill-tag">
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <div className="info-grid">
          {/* Education */}
          <section className="brutalism-section info-card">
            <h3 className="section-label">EDUCATION</h3>
            <p className="info-value">{bio.education}</p>
          </section>

          {/* Location */}
          <section className="brutalism-section info-card">
            <h3 className="section-label">LOCATION</h3>
            <p className="info-value">{bio.location}</p>
          </section>
        </div>

        {/* Contact Section */}
        <section className="brutalism-section contact-section">
          <h3 className="section-label">CONTACT</h3>
          <div className="contact-grid">
            <div className="contact-item">
              <span className="contact-label">EMAIL:</span>
              <a href={`mailto:${bio.email}`} className="contact-link">{bio.email}</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">PHONE:</span>
              <a href={`tel:${bio.phone}`} className="contact-link">{bio.phone}</a>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="brutalism-section social-section">
          <h3 className="section-label">SOCIAL MEDIA</h3>
          <div className="social-grid">
            {Object.entries(bio.social)
              .filter(([_, username]) => username !== undefined)
              .map(([platform, username]) => (
              <a 
                key={platform} 
                href={`https://${platform}.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="social-btn"
              >
                {platform.toUpperCase()}
              </a>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="brutalism-section achievements-section">
          <h3 className="section-label">ACHIEVEMENTS</h3>
          <ul className="achievements-list">
            {bio.achievements.map((achievement, index) => (
              <li key={index} className="achievement-item">
                <span className="achievement-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="achievement-text">{achievement}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="brutalism-footer">
        <p>KKN-T UNIRA MALANG DESA SRIGONCO</p>
      </footer>
    </div>
  );
}
