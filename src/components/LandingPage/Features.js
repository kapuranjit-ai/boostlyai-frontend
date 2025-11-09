import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-chart-line',
      title: 'SEO Analyzer',
      description: 'Get detailed analysis of your website\'s SEO health with actionable insights to improve rankings.'
    },
    {
      icon: 'fas fa-key',
      title: 'Keyword Research',
      description: 'Discover high-value keywords with AI-powered suggestions and competition analysis.'
    },
    {
      icon: 'fas fa-tags',
      title: 'Metatag Generator',
      description: 'Create optimized meta titles and descriptions that improve click-through rates.'
    },
    {
      icon: 'fas fa-newspaper',
      title: 'Content Generator',
      description: 'Produce high-quality, SEO-optimized articles and blog posts with AI assistance.'
    },
    {
      icon: 'fas fa-share-alt',
      title: 'Social Publishing',
      description: 'Schedule and publish content across all your social media channels from one dashboard.'
    },
    {
      icon: 'fas fa-users',
      title: 'Competitor Analysis',
      description: 'Gain insights into your competitors\' strategies and identify opportunities to outperform them.'
    }
  ];

  return (
    <section className="features" id="features">
      <div className="section-title">
        <h2>Powerful AI Features</h2>
        <p>Our comprehensive suite of tools helps you dominate search rankings and social media engagement</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <i className={feature.icon}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;