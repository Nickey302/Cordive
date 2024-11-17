'use client'

import { useState } from 'react';
import styles from './MaterialPreview.module.css';
//
//
//
const MaterialPreview = ({ materials, onSelect }) => {
    return (
        <div className={styles.previewContainer}>
            <h3>Choose Your Material</h3>
            <div className={styles.materialsGrid}>
                {materials.map((material) => (
                    <div 
                        key={material.name}
                        className={styles.materialItem}
                        onClick={() => onSelect(material.name)}
                    >
                        <div 
                            className={styles.colorPreview} 
                            style={{ backgroundColor: material.color }}
                        />
                        <span>{material.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MaterialPreview; 