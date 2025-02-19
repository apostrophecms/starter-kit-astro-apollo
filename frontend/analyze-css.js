/**
 * CSS Build Analyzer
 * 
 * Analyzes CSS files in an Astro build output directory, generating statistics and 
 * processed versions for analysis.
 * 
 * Usage:
 * 1. Place this script in your Astro project
 * 2. Run after building: node analyze-css.js
 * 
 * Output:
 * - Creates a 'css-analysis' directory
 * - Generates processed CSS files with 'processed-' prefix
 * - Prints statistics for each CSS file:
 *   - File size in KB
 *   - Number of CSS rules
 *   - Number of selectors
 * 
 * Note: Currently configured for Astro's default 'dist' build directory
 */
import fs from 'fs/promises';
import path from 'path';

/**
 * Analyzes CSS files in the build directory and generates statistics and processed versions
 * @async
 * @returns {Promise<void>}
 * @throws {Error} If there are issues accessing the build directory or processing files
 */
async function analyzeCSSBuild() {
    // Default Astro build output directory
    const buildDir = path.join(process.cwd(), 'dist');
    
    try {
        // Find all CSS files in the build directory
        const cssFiles = await findCSSFiles(buildDir);
        
        // Create an output directory for analysis
        const analysisDir = path.join(process.cwd(), 'css-analysis');
        await fs.mkdir(analysisDir, { recursive: true });
        
        // Process each CSS file
        for (const file of cssFiles) {
            const content = await fs.readFile(file, 'utf-8');
            const filename = path.basename(file);
            
            // Save the processed CSS to analysis directory
            await fs.writeFile(
                path.join(analysisDir, `processed-${filename}`),
                content
            );
            
            // Log basic statistics
            console.log(`\nAnalysis for ${filename}:`);
            console.log(`Size: ${(content.length / 1024).toFixed(2)}KB`);
            console.log(`Rules: ${countCSSRules(content)}`);
            console.log(`Selectors: ${countSelectors(content)}`);
        }
        
        console.log(`\nAnalysis complete! Check the 'css-analysis' directory for processed files.`);
    } catch (error) {
        console.error('Error analyzing CSS build:', error);
    }
}

/**
 * Recursively finds all CSS files in a directory and its subdirectories
 * @async
 * @param {string} dir - The directory path to scan for CSS files
 * @returns {Promise<string[]>} Array of full paths to CSS files
 * @throws {Error} If there are issues accessing the directory
 */
async function findCSSFiles(dir) {
    const cssFiles = [];
    
    async function scan(currentDir) {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            
            if (entry.isDirectory()) {
                await scan(fullPath);
            } else if (entry.isFile() && path.extname(entry.name) === '.css') {
                cssFiles.push(fullPath);
            }
        }
    }
    
    await scan(dir);
    return cssFiles;
}

/**
 * Counts the number of CSS rules in a stylesheet
 * @param {string} css - The CSS content to analyze
 * @returns {number} The number of CSS rules found
 */
function countCSSRules(css) {
    // Basic rule counting (can be enhanced for more accuracy)
    return css.split('}').length - 1;
}

/**
 * Counts the number of selectors in a stylesheet
 * @param {string} css - The CSS content to analyze
 * @returns {number} The number of selectors found
 */
function countSelectors(css) {
    // Basic selector counting (can be enhanced for more accuracy)
    return css.split('{').length - 1;
}

// Run the analysis
analyzeCSSBuild();