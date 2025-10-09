"use client";

import { useState, useEffect } from 'react';

// This hook determines which section is currently in the viewport
export const useActiveSection = (itemIds: string[]) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      let currentSectionId = '';
      
      for (const itemId of itemIds) {
        // The ID in the href (e.g., /#achievements) needs to match an element's id="achievements"
        const elementId = itemId.replace('/#', '');
        const element = document.getElementById(elementId);

        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if the section is within the top 75% of the viewport
          if (rect.top >= 0 && rect.top < window.innerHeight * 0.75) {
            currentSectionId = itemId;
            break; // Stop when the first matching section is found
          }
        }
      }
      setActiveSection(currentSectionId);
    };

    // Set initial section on mount and listen for scroll events
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, [itemIds]);

  return activeSection;
};