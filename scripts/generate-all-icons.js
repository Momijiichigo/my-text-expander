#!/usr/bin/env node

import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function drawIcon(canvas, size, isInactive = false) {
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    if (isInactive) {
        gradient.addColorStop(0, '#9CA3AF'); // gray-400
        gradient.addColorStop(1, '#6B7280'); // gray-500
    } else {
        gradient.addColorStop(0, '#3B82F6'); // blue-500
        gradient.addColorStop(1, '#1D4ED8'); // blue-700
    }
    
    // Draw circle background
    ctx.beginPath();
    ctx.arc(size/2, size/2, (size-2)/2, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Scale factors for different sizes
    const scale = size / 16;
    
    // Text and arrow color
    ctx.fillStyle = isInactive ? '#F3F4F6' : '#FFFFFF'; // gray-100 for inactive, white for active
    ctx.strokeStyle = isInactive ? '#F3F4F6' : '#FFFFFF';
    ctx.lineWidth = 0.5 * scale;
    
    // Abbreviated text lines (left side)
    ctx.fillRect(2 * scale, 5 * scale, 2 * scale, 0.5 * scale);
    ctx.fillRect(2 * scale, 7 * scale, 3 * scale, 0.5 * scale);
    ctx.fillRect(2 * scale, 9 * scale, 2.5 * scale, 0.5 * scale);
    
    // Arrow
    ctx.beginPath();
    ctx.moveTo(5.5 * scale, 8 * scale);
    ctx.lineTo(8.5 * scale, 8 * scale);
    ctx.moveTo(7.5 * scale, 7 * scale);
    ctx.lineTo(8.5 * scale, 8 * scale);
    ctx.lineTo(7.5 * scale, 9 * scale);
    ctx.stroke();
    
    // Expanded text lines (right side)
    ctx.fillRect(10 * scale, 4.5 * scale, 4 * scale, 0.4 * scale);
    ctx.fillRect(10 * scale, 6 * scale, 3.5 * scale, 0.4 * scale);
    ctx.fillRect(10 * scale, 7.5 * scale, 4.2 * scale, 0.4 * scale);
    ctx.fillRect(10 * scale, 9 * scale, 3.8 * scale, 0.4 * scale);
    ctx.fillRect(10 * scale, 10.5 * scale, 3 * scale, 0.4 * scale);
}

function generateAllIcons() {
    const sizes = [16, 32, 48, 128];
    const iconsDir = join(__dirname, '..', 'public', 'assets', 'icons');
    
    // Create icons directory if it doesn't exist
    mkdirSync(iconsDir, { recursive: true });
    
    // Generate active icons
    sizes.forEach(size => {
        const canvas = createCanvas(size, size);
        drawIcon(canvas, size, false);
        
        const buffer = canvas.toBuffer('image/png');
        const filename = `icon${size}.png`;
        const filepath = join(iconsDir, filename);
        
        writeFileSync(filepath, buffer);
        console.log(`Generated ${filename}`);
    });
    
    // Generate inactive icons
    sizes.forEach(size => {
        const canvas = createCanvas(size, size);
        drawIcon(canvas, size, true);
        
        const buffer = canvas.toBuffer('image/png');
        const filename = `icon-inactive${size}.png`;
        const filepath = join(iconsDir, filename);
        
        writeFileSync(filepath, buffer);
        console.log(`Generated ${filename}`);
    });
    
    console.log('All icons generated successfully!');
}

// Run the script
generateAllIcons();
